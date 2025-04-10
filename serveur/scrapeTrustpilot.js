const puppeteer = require("puppeteer");
const crypto = require("crypto");
const { Review } = require("./model/model");

require("dotenv").config();

const launchBrowserWithFallback = async () => {
  try {
    return await puppeteer.launch({
      headless: true,
      args: [
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-features=IsolateOrigins,site-per-process',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117 Safari/537.36'
      ]
    });
  } catch (err) {
    console.warn("Erreur lancement headless, tentative fallback...");

    return await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--ignore-certificate-errors']
    });
  }
};

const scrapeTrustpilot = async (baseUrl, name = "Trustpilot") => {
  let browser;
  let avgRating = null;
  let totalReviews = null;
  let allReviews = [];

  try {
    browser = await launchBrowserWithFallback();
    const page = await browser.newPage();

    for (let currentPage = 1; currentPage <= 10; currentPage++) {
      const url = `${baseUrl}?page=${currentPage}`;
      console.log(`Scraping ${url}...`);

      try {
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        if (response.status() === 404) break;

        const title = await page.title();
        const h1 = await page.$eval("h1", (el) => el.innerText).catch(() => "");
        if (title.includes("Page non trouvée") || h1.includes("Page non trouvée")) break;

        if (currentPage === 1) {
          // Cookies
          try {
            const acceptBtn = '[id^="onetrust-accept-btn-handler"]';
            await page.waitForSelector(acceptBtn, { timeout: 5000 });
            await page.click(acceptBtn);
            console.log("Cookies acceptés");
          } catch {
            console.log("Aucun bouton cookies trouvé");
          }

          // Note moyenne & nombre d'avis
          try {
            const ratingSelector = '[data-rating-typography]';
            await page.waitForSelector(ratingSelector, { timeout: 5000 });
            avgRating = await page.$eval(ratingSelector, el => parseFloat(el.innerText.trim()));
          } catch {
            console.warn("Impossible de récupérer la note moyenne");
          }

          try {
            const totalSelector = 'h1 span.styles_reviewsAndRating__Syz6V';
            await page.waitForSelector(totalSelector, { timeout: 5000 });
            totalReviews = await page.$eval(totalSelector, el => {
              const match = el.innerText.match(/Avis\s+(\d+)/);
              return match ? parseInt(match[1]) : null;
            });
          } catch {
            console.warn("Impossible de récupérer le nombre total d’avis");
          }
        }

        await page.waitForSelector('[data-service-review-card-paper]', { timeout: 10000 });

        const rawReviews = await page.$$eval('[data-service-review-card-paper]', (cards, currentPage) =>
          cards.map((card) => {
            // Note de l'avis
            const ratingEl = card.querySelector('[data-service-review-rating] img');
            const rating = ratingEl ? parseInt(ratingEl.alt.match(/(\d)/)?.[1]) : null;

            // Date
            const date = card.querySelector("time")?.innerText.trim() || "";
            const iso_date = card.querySelector("time")?.getAttribute("datetime") || null;

            // Texte de l'avis
            const text = card.querySelector("[data-service-review-text-typography]")?.innerText.trim() || "";

            // Infos utilisateur
            const profileLinkEl = card.querySelector('[data-consumer-profile-link="true"]');
            const name = profileLinkEl?.querySelector('[data-consumer-name-typography]')?.innerText.trim() || "Utilisateur";
            const link = profileLinkEl?.getAttribute("href") ? `https://fr.trustpilot.com${profileLinkEl.getAttribute("href")}` : null;
            const country = profileLinkEl?.querySelector('[data-consumer-country-typography]')?.innerText.trim() || "";
            const reviewsCountText = profileLinkEl?.querySelector('[data-consumer-reviews-count-typography]')?.innerText.trim() || "";
            const reviewsCount = parseInt(reviewsCountText.match(/\d+/)?.[0]) || 0;

            // Lien vers l'avis
            const reviewLinkPath = card.querySelector('[data-review-title-typography]')?.closest("a")?.getAttribute("href") || "";
            const reviewLink = reviewLinkPath ? `https://fr.trustpilot.com${reviewLinkPath}` : null;

            return {
              rating,
              date,
              iso_date,
              text,
              link: reviewLink,
              source: "Trustpilot",
              user: {
                name,
                link,
                reviews: reviewsCount,
                country,
                contributor_id: null,
                thumbnail: null,
                photos: 0,
              },
            };
          }),
          currentPage
        );

        
        // Log côté Node pour les cas où le nom est manquant
        rawReviews
          .filter(r => r.debugMissingName)
          .forEach((r, i) => {
            console.warn(`⚠️ Avis #${i + 1} sans nom utilisateur`);
          });
        

        const reviews = rawReviews.map((r) => {
          const hash = crypto
            .createHash("sha256")
            .update(`${r.text}-${r.iso_date}-${r.user.name}`)
            .digest("hex");

          return {
            ...r,
            review_id: hash,
            site: name,
          };
        });

        allReviews.push(...reviews);
      } catch (err) {
        console.error(`Erreur scraping ${url} :`, err.message);
        break;
      }
    }

    const valid = allReviews.filter((r) => typeof r.rating === "number");
    console.log(`${valid.length} avis valides récupérés pour ${name}`);

    if (valid.length > 0) {
      const reviewIds = valid.map((r) => r.review_id);
      const existing = await Review.find({ review_id: { $in: reviewIds } }).select("review_id");
      const existingIds = new Set(existing.map((e) => e.review_id));

      const newReviews = valid.filter((r) => !existingIds.has(r.review_id));

      if (newReviews.length > 0) {
        const ops = newReviews.map((r) => ({
          updateOne: {
            filter: { review_id: r.review_id },
            update: { $setOnInsert: r },
            upsert: true,
          },
        }));

        const result = await Review.bulkWrite(ops, { ordered: false });
        console.log(`✔️ ${result.upsertedCount} nouveaux avis ajoutés pour ${name}`);

        return {
          inserted: result.upsertedCount,
          avgRating,
          totalReviews,
        };
      } else {
        console.log("Aucun avis à insérer (tous déjà présents)");
      }
    }

    return { inserted: 0, avgRating, totalReviews };
  } catch (error) {
    console.error("Erreur critique Trustpilot :", error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = scrapeTrustpilot;

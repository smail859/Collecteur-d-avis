const puppeteer = require("puppeteer");
const crypto = require("crypto");
const { Review } = require("./model/model");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

// === CONFIG CHROMIUM ===
const chromePath = path.join(
  __dirname,
  "../chromium/chrome/linux-135.0.7049.95/chrome-linux64/chrome"
);

const launchBrowserWithFallback = async () => {
  if (!fs.existsSync(chromePath)) {
    throw new Error("❌ Chromium introuvable au chemin : " + chromePath);
  }

  console.log("🔧 Utilisation de Chromium depuis :", chromePath);
  puppeteer._preferredRevision = "135.0.7049.95";

  return puppeteer.launch({
    headless: "new",
    executablePath: chromePath,
    timeout: 60000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--no-zygote",
      "--disable-background-networking",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-features=site-per-process",
      "--disable-hang-monitor",
      "--disable-popup-blocking",
      "--disable-infobars",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-first-run",
      "--safebrowsing-disable-auto-update",
      "--ignore-certificate-errors",
      "--disable-extensions"
    ]
  });
};

// === SCRAPE FUNCTION ===
const scrapeTrustpilot = async (baseUrl, name = "Trustpilot") => {
  let browser;
  let page;
  let avgRating = null;
  let totalReviews = null;
  let allReviews = [];

  try {
    browser = await launchBrowserWithFallback();
    page = await browser.newPage();

    for (let currentPage = 1; currentPage <= 10; currentPage++) {
      const url = `${baseUrl}?page=${currentPage}`;
      console.log(`🔍 Scraping ${url}...`);

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      } catch (err) {
        console.error(`❌ Erreur navigation ${url} : ${err.message}`);
        break;
      }

      const title = await page.title();
      const h1 = await page.$eval("h1", (el) => el.innerText).catch(() => "");
      if (title.includes("Page non trouvée") || h1.includes("Page non trouvée")) break;

      if (currentPage === 1) {
        try {
          const acceptBtn = '[id^="onetrust-accept-btn-handler"]';
          await page.waitForSelector(acceptBtn, { timeout: 5000 });
          await page.click(acceptBtn);
          console.log("✅ Cookies acceptés");
        } catch {
          console.log("ℹ️ Aucun bouton cookies trouvé");
        }

        try {
          const ratingSelector = '[data-rating-typography]';
          await page.waitForSelector(ratingSelector, { timeout: 5000 });
          avgRating = await page.$eval(ratingSelector, el => parseFloat(el.innerText.trim()));
        } catch {
          console.warn("⚠️ Impossible de récupérer la note moyenne");
        }

        try {
          const totalSelector = 'h1 span.styles_reviewsAndRating__Syz6V';
          await page.waitForSelector(totalSelector, { timeout: 5000 });
          totalReviews = await page.$eval(totalSelector, el => {
            const match = el.innerText.match(/Avis\s+(\d+)/);
            return match ? parseInt(match[1]) : null;
          });
        } catch {
          console.warn("⚠️ Impossible de récupérer le nombre total d’avis");
        }
      }

      try {
        await page.waitForSelector('[data-service-review-card-paper]', { timeout: 10000 });
      } catch (err) {
        console.warn(`⚠️ Aucune review trouvée sur ${url} : ${err.message}`);
        continue;
      }

      const rawReviews = await page.$$eval('[data-service-review-card-paper]', (cards) =>
        cards.map((card) => {
          // === BLOC DE SCRAPING NON MODIFIÉ ===
          const ratingEl = card.querySelector('[data-service-review-rating] img');
          const rating = ratingEl ? parseInt(ratingEl.alt.match(/(\d)/)?.[1]) : null;
          const date = card.querySelector("time")?.innerText.trim() || "";
          const iso_date = card.querySelector("time")?.getAttribute("datetime") || null;
          const text = card.querySelector("[data-service-review-text-typography]")?.innerText.trim() || "";

          const profileLinkEl = card.querySelector('[data-consumer-profile-link="true"]');
          const name = profileLinkEl?.querySelector('[data-consumer-name-typography]')?.innerText.trim() || "Utilisateur";
          const link = profileLinkEl?.getAttribute("href") ? `https://fr.trustpilot.com${profileLinkEl.getAttribute("href")}` : null;
          const country = profileLinkEl?.querySelector('[data-consumer-country-typography]')?.innerText.trim() || "";
          const reviewsCountText = profileLinkEl?.querySelector('[data-consumer-reviews-count-typography]')?.innerText.trim() || "";
          const reviewsCount = parseInt(reviewsCountText.match(/\d+/)?.[0]) || 0;

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
        })
      );

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

      // Petite pause pour éviter la surcharge CPU
      await new Promise((r) => setTimeout(r, 1000));
    }

    const valid = allReviews.filter((r) => typeof r.rating === "number");
    console.log(`✅ ${valid.length} avis valides récupérés pour ${name}`);

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
        console.log("ℹ️ Aucun nouvel avis à insérer");
      }
    }

    return { inserted: 0, avgRating, totalReviews };
  } catch (error) {
    console.error("❌ Erreur critique Trustpilot :", error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = scrapeTrustpilot;

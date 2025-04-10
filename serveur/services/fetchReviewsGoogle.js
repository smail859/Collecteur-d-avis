const { getJson } = require("serpapi");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const { googleSites } = require("../config/sites");
const { Review, UpdateLog } = require("../model/model.js");
const { formatRelativeDate } = require("../utils/dateUtils");
const updateCache = require("../updateCache.js");

const fetchReviewsForSite = async (site) => {
  if (!site?.id) {
    console.warn(`❌ Site mal formé : ${site?.name}`);
    return { site: site?.name || "Inconnu", reviews: [] };
  }

  let allReviews = [];
  let nextPageToken = null;

  try {
    do {
      const params = {
        engine: "google_maps_reviews",
        data_id: site.id,
        hl: "fr",
        api_key: process.env.SERPAPI_KEY,
        reviews_limit: 50,
        ...(nextPageToken && { next_page_token: nextPageToken }),
      };

      const json = await new Promise((resolve, reject) => {
        getJson(params, (data) => {
          if (data.error) return reject(new Error(data.error));
          resolve(data);
        });
      });

      if (!json?.reviews?.length) break;

      const existingIds = new Set(
        (await Review.find({ review_id: { $in: json.reviews.map(r => r.review_id) } }))
          .map(r => r.review_id)
      );

      const newReviews = json.reviews
        .filter(r => !existingIds.has(r.review_id))
        .map(r => ({
          review_id: r.review_id,
          data_id: site.id,
          site: site.name,
          link: r.link,
          rating: r.rating,
          snippet: r.snippet,
          iso_date: new Date(r.iso_date),
          iso_date_of_last_edit: new Date(r.iso_date_of_last_edit || r.iso_date),
          date: r.date || "",
          source: r.source,
          likes: r.likes || 0,
          user: {
            name: r.user.name,
            link: r.user.link,
            contributor_id: r.user.contributor_id,
            thumbnail: r.user.thumbnail,
            reviews: r.user.reviews || 0,
            photos: r.user.photos || 0,
          }
        }));

      if (newReviews.length) {
        await Review.insertMany(newReviews, { ordered: false }).catch(() => {});
        allReviews.push(...newReviews);
      }

      nextPageToken = json.serpapi_pagination?.next_page_token || null;
      if (nextPageToken) await delay(2000); // Respecter le délai API

    } while (nextPageToken);

    return { site: site.name, reviews: allReviews };
  } catch (err) {
    console.error(`Erreur fetchReviewsForSite pour ${site.name} :`, err.message);
    return { site: site.name, reviews: [] };
  }
};

const updateLatestReviews = async () => {
  const newReviewIds = new Set();

  const results = await Promise.allSettled(
    googleSites.map(async (site) => {
      try {
        const latestInDb = await Review.find({ site: site.name }).sort({ iso_date: -1 }).limit(10);
        const existingMap = new Map(latestInDb.map(r => [r.review_id, r]));

        const json = await new Promise((resolve, reject) => {
          getJson({
            engine: "google_maps_reviews",
            data_id: site.id,
            hl: "fr",
            api_key: process.env.SERPAPI_KEY,
            reviews_limit: 20,
            sort_by: "newestFirst",
          }, (data) => {
            if (data.error) return reject(new Error(data.error));
            resolve(data);
          });
        });

        if (!json?.reviews?.length) {
          console.warn(`Aucun avis récent pour ${site.name}`);
          return;
        }

        const newReviews = [];

        for (const r of json.reviews) {
          const doc = {
            review_id: r.review_id,
            data_id: site.id,
            site: site.name,
            link: r.link,
            rating: r.rating,
            snippet: r.snippet,
            iso_date: new Date(r.iso_date),
            iso_date_of_last_edit: new Date(r.iso_date_of_last_edit || r.iso_date),
            date: formatRelativeDate(new Date(r.iso_date)),
            source: r.source,
            likes: r.likes || 0,
            user: {
              name: r.user.name,
              link: r.user.link,
              contributor_id: r.user.contributor_id,
              thumbnail: r.user.thumbnail,
              reviews: r.user.reviews || 0,
              photos: r.user.photos || 0,
            },
          };

          const existing = existingMap.get(r.review_id);
          if (!existing) {
            newReviews.push(doc);
            newReviewIds.add(r.review_id);
          } else {
            await Review.updateOne(
              { review_id: r.review_id },
              {
                $set: {
                  iso_date: doc.iso_date,
                  iso_date_of_last_edit: doc.iso_date_of_last_edit,
                  date: doc.date,
                  snippet: r.snippet,
                  likes: r.likes || 0,
                },
              }
            );
          }
        }

        if (newReviews.length > 0) {
          await Review.insertMany(newReviews, { ordered: false });
        }

        console.log(`✔ ${newReviews.length} nouveaux avis ajoutés pour ${site.name}`);
      } catch (err) {
        console.error(`❌ Erreur lors de la mise à jour de ${site.name} : ${err.message}`);
        throw err;
      }
    })
  );

  const hasError = results.some(r => r.status === "rejected");
  if (hasError) throw new Error("Une ou plusieurs erreurs dans updateLatestReviews");

  await updateCache();
  await UpdateLog.findOneAndUpdate({}, { updatedAt: new Date() }, { upsert: true });

  console.log("✅ Mise à jour Google terminée + cache mis à jour");
};

module.exports = {
  fetchReviewsForSite,
  updateLatestReviews,
}
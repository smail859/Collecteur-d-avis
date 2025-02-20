const { getJson } = require("serpapi");

const dataId = "0x479184d4eff4c4d7:0x7899f13a20c78918";

getJson({
  engine: "google_maps_reviews",
  data_id: dataId,
  hl: "fr",
  api_key: "4546b3a57afe8d74757c0ddb90ef60d2e778e2afce5ffc489d971792699a9256",
  reviews_limit: 50
}, (json) => {
  console.log("Première page :", json["reviews"]);

  if (json["serpapi_pagination"] && json["serpapi_pagination"]["next"]) {
    console.log("URL de la page suivante :", json["serpapi_pagination"]["next"]);
  }
});

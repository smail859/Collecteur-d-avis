// models.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review_id: { type: String, unique: true },
  data_id: { type: String, default: null }, // null pour Trustpilot
  site: String,
  link: String,
  rating: Number,
  snippet: { type: String, default: "" },   // texte Google
  text: { type: String, default: "" },      // texte Trustpilot
  iso_date: Date,
  iso_date_of_last_edit: Date,
  date: String,
  response: {
    snippet: { type: String, default: "" },
    iso_date: { type: Date },
    date: { type: String },
  },
  source: {
    type: String,
    enum: ["Google", "Trustpilot"],
    set: (v) => {
      if (!v) return v;
      const formatted = v.toLowerCase();
      if (formatted === "trustpilot") return "Trustpilot";
      if (formatted === "google") return "Google";
      return v;
    }
  },  
  likes: { type: Number, default: 0 },
  user: {
    name: { type: String, default: "" },
    link: { type: String, default: null },
    reviews: { type: Number, default: 0 },
    country: { type: String, default: "" },
    contributor_id: { type: String, default: null },
    thumbnail: { type: String, default: null },
    photos: { type: Number, default: 0 },
  },
  
}, {timestamps: true});

const updateLogSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now },
});

const updateLogTrustpilotSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now },
});



const CommercialSchema = new mongoose.Schema({
  service: { type: String, required: true },
  label: { type: String, required: true },
  variants: { type: [String], default: [] }
}, { timestamps: true });

// Forçage des noms de collections explicites
const Review = mongoose.model("Review", reviewSchema, "reviews", updateLogSchema, "update_log_google");
const UpdateLog = mongoose.model("UpdateLog", updateLogSchema,);
const UpdateLogTrustpilot = mongoose.model("UpdateLogTrustpilot", updateLogTrustpilotSchema, "update_log_trustpilot");
const Commercial = mongoose.model("Commercial", CommercialSchema, "commerciaux");


module.exports = { Review, UpdateLog, UpdateLogTrustpilot, Commercial};

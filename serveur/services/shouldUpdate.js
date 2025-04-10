// -------------------------
// Vérifie s'il faut mettre à jour
// -------------------------

const {UpdateLog, UpdateLogTrustpilot} = require("../model/model.js")
const CHECK_INTERVAL_DAYS = 2; 

const shouldUpdateReviewsTrustpilot = async () => {
    const now = new Date();
  
    const lastLogTrustpilot = await UpdateLogTrustpilot.findOne().sort({ updatedAt: -1 });
  
    const diffTrustpilot = lastLogTrustpilot ? (now - lastLogTrustpilot.updatedAt) / (1000 * 60 * 60 * 24) : Infinity;
  
    return diffTrustpilot >= CHECK_INTERVAL_DAYS;
  };
  
const shouldUpdateReviews = async () => {
    const now = new Date();
  
    const lastLog = await UpdateLog.findOne().sort({ updatedAt: -1 });
    const lastLogTrustpilot = await UpdateLogTrustpilot.findOne().sort({ updatedAt: -1 });
  
    const diffGoogle = lastLog ? (now - lastLog.updatedAt) / (1000 * 60 * 60 * 24) : Infinity;
    const diffTrustpilot = lastLogTrustpilot ? (now - lastLogTrustpilot.updatedAt) / (1000 * 60 * 60 * 24) : Infinity;
  
    return diffGoogle >= CHECK_INTERVAL_DAYS || diffTrustpilot >= CHECK_INTERVAL_DAYS;
};

module.exports = {
    shouldUpdateReviews,
    shouldUpdateReviewsTrustpilot
}
  
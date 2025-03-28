import axios from 'axios';

/**
 * Récupère tous les avis (Google + Trustpilot)
 */
export const fetchAllReviews = async () => {
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  // Récupération avis Google
  const googleResponse = await axios.get(`${baseURL}/api/reviews`);
  const googleData = Object.entries(googleResponse.data).flatMap(([service, data]) =>
    (data.reviews || []).map(review => ({ ...review, service }))
  );

  // Récupération avis Trustpilot
  const trustpilotResponse = await axios.get(`${baseURL}/api/trustpilot`);
  const trustpilotData = Object.entries(trustpilotResponse.data).flatMap(([service, data]) =>
    (data.reviews || []).map(review => ({ ...review, service, source: "Trustpilot" }))
  );

  // Fusion des résultats
  const combinedReviews = [...googleData, ...trustpilotData];

  return {
    googleData,
    trustpilotData,
    combined: combinedReviews
  };
};

/**
 * Récupère uniquement les avis Trustpilot
 */
export const fetchTrustpilotReviews = async () => {
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const response = await axios.get(`${baseURL}/api/trustpilot`);
  return Object.entries(response.data).flatMap(([service, data]) =>
    (data.reviews || []).map(review => ({ ...review, service, source: "Trustpilot" }))
  );
};
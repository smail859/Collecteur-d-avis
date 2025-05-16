import axios from "axios";

/**
 * Récupère les commerciaux et reconstruit la structure { service: { label: [variants] } }
 */
const isProd = window.location.hostname !== "localhost";
const baseURL = isProd
  ? "https://collecteur-avis.onrender.com"
  : "http://localhost:5000";

export const fetchCommerciauxParService = async () => {
  try {
    const { data: commerciaux } = await axios.get(`${baseURL}/api/commerciaux`);

    const commerciauxParService = {};
    commerciaux.forEach(({ service, label, variants }) => {
      if (!commerciauxParService[service]) commerciauxParService[service] = {};
      commerciauxParService[service][label] = variants;
    });

    return commerciauxParService;
  } catch (error) {
    console.error("Erreur lors du fetch des commerciaux :", error);
    return {}; 
  }
};

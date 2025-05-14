import axios from "axios";

/**
 * Récupère les commerciaux et reconstruit la structure { service: { label: [variants] } }
 */
export const fetchCommerciauxParService = async () => {
  const { data: commerciaux } = await axios.get("http://localhost:5000/api/commerciaux");

  const commerciauxParService = {};
  commerciaux.forEach(({ service, label, variants }) => {
    if (!commerciauxParService[service]) commerciauxParService[service] = {};
    commerciauxParService[service][label] = variants;
  });

  return commerciauxParService;
};
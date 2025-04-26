export const detectCommercialName = (text, service, commerciauxParService) => {
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedText = normalize(text);
  
    if (!commerciauxParService[service]) return null;
  
    for (const [commercialKey, variants] of Object.entries(commerciauxParService[service])) {
      for (const variant of variants) {
        const regex = new RegExp(`\\b${normalize(variant)}\\b`, "i");
        if (regex.test(normalizedText)) return commercialKey;
      }
    }
  
    return null;
};
  
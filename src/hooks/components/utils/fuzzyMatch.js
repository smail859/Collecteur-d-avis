import Fuse from "fuse.js";

export const searchCommercialName = (text, variationsParService, service) => {
    if (!text || !variationsParService[service]) return [];
  
    const normalize = (str) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    const mots = normalize(text).split(/\W+/); // Coupe sur tout sauf lettres/nombres
    const detected = new Set();
  
    Object.entries(variationsParService[service]).forEach(([key, variations]) => {
      const fuse = new Fuse(variations.map(normalize), { threshold: 0.3 });
  
      mots.forEach((mot) => {
        const found = fuse.search(mot);
        if (found.length > 0) {
          detected.add(key);
        }
      });
    });
  
    return [...detected];
  };
  
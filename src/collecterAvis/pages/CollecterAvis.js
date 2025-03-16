import AvisServices from '../components/AvisServices';
import MONBIEN from "../../image/MONBIEN.png";
import STARTLOC from "../../image/STARTLOC.png";
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png";
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png";
import SINIMO from "../../image/SINIMO.png";
import PIGEONLINE from "../../image/PIGEONLINE.png";


const servicesData = [
    {
      name: "Monbien",
      icon: MONBIEN, 
      links: [
        { url: "https://marketing-immo.fr/Google", platform: "Google" },
        { url: "https://marketing-immo.fr/Trustpilot", platform: "Trustpilot" }
      ]
    },
    {
      name: "Startloc",
      icon: STARTLOC,
      links: [
        { url: "https://g.page/r/CRiJxyA68Zl4EBE/review", platform: "Google" },
        { url: "https://marketing-immo.fr/Trustpilot", platform: "Trustpilot" }
      ]
    },
    {
      name: "Marketing Automobile",
      icon: MARKETINGAUTO,
      links: [
        { url: "https://marketing-immo.fr/Google", platform: "Google" },
        { url: "https://marketing-immo.fr/Trustpilot", platform: "Trustpilot" }
      ]
    },
    {
      name: "Marketing Immobilier",
      icon: MARKETINGIMMO,
      links: [
        { url: "https://marketing-immo.fr/Google", platform: "Google" },
        { url: "https://marketing-immo.fr/Trustpilot", platform: "Trustpilot" }
      ]
    },
    {
      name: "Sinimo",
      icon: SINIMO,
      links: [
        { url: "https://marketing-immo.fr/Google", platform: "Google" },
        { url: "https://fr.trustpilot.com/evaluate/sinimo.fr", platform: "Trustpilot" }
      ]
    },
    {
      name: "Pige Online",
      icon: PIGEONLINE,
      links: [
        { url: "https://marketing-immo.fr/Google", platform: "Google" },
        { url: "https://fr.trustpilot.com/evaluate/pige-online.fr", platform: "Trustpilot" }
      ]
      
    }
  ];

  const handleCopy = (serviceName, link) => {
    navigator.clipboard.writeText(link);  
    alert(`Lien copié pour ${serviceName} : ${link}`);
  };

  function CollecterAvis() {
    return (
      <div>
        <AvisServices
          title="Collectez des avis clients"
          subtitle="Sélectionnez un service et partagez son lien pour récolter des avis."
          services={servicesData}  // Liste des services
          onCopy={handleCopy} 
        />
      </div>
    );
  }
  
  export default CollecterAvis;
  
  
  
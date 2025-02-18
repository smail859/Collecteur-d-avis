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
        "https://monbien.fr/avis",
        "https://monbien.fr/contact"
      ],
    },
    {
      name: "Startloc",
      icon: STARTLOC,
      links: [
        "https://startloc.fr/avis",
        "https://startloc.fr/contact"
      ]
    },
    {
      name: "Marketing Automobile",
      icon: MARKETINGAUTO,
      links: [
        "https://marketing-immo.fr/avis"
      ]
    },
    {
      name: "Marketing Immobilier",
      icon: MARKETINGIMMO,
      links: [
        "https://marketing-immo.fr/avis"
      ]
    },
    {
      name: "Sinimo",
      icon: SINIMO,
      links: [
        "https://marketing-immo.fr/avis"
      ]
    },
    {
      name: "Pige Online",
      icon: PIGEONLINE,
      links: [
        "https://marketing-immo.fr/avis"
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
  
  
  
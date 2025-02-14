import AvisServices from '../components/AvisServices';


const servicesData = [
    {
      name: "Monbien",
      icon: "/icons/monbien.png", 
      links: [
        "https://monbien.fr/avis",
        "https://monbien.fr/contact"
      ],
    },
    {
      name: "Startloc",
      icon: "/icons/startloc.png",
      links: [
        "https://startloc.fr/avis",
        "https://startloc.fr/contact"
      ]
    },
    {
      name: "Marketing Immobilier",
      icon: "/icons/marketing-immo.png",
      links: [
        "https://marketing-immo.fr/avis"
      ]
    }
  ];

  const handleCopy = (serviceName, link) => {
    navigator.clipboard.writeText(link);  
    alert(`Lien copié pour ${serviceName} : ${link}`);
  };

  function Dashboard() {
    return (
      <div>
        <AvisServices
          title="Collectez des avis clients"
          subtitle="Sélectionnez un service et partagez son lien pour récolter des avis."
          services={servicesData}  // ✅ Liste des services
          onCopy={handleCopy} 
        />
      </div>
    );
  }
  
  export default Dashboard;
  
  
  
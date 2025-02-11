import CollecterAvis from './CollecterAvis';

const servicesData = [
  { name: 'Monbien', icon: '/icons/monbien.png', links: ['Google', 'Trustpilot'] },
  { name: 'Startloc', icon: '/icons/startloc.png', links: ['Google', 'Trustpilot', 'App Store', 'Google Play'] },
  { name: 'Sinimo', icon: '/icons/sinimo.png', links: ['Google', 'Trustpilot', 'App Store', 'Google Play'] },
];

function App() {
  const handleCopy = (service, link) => {
    console.log(`Lien copié pour ${service} - ${link}`);
  };

  return (
    <CollecterAvis
      title="Collecter des avis"
      subtitle="Générez un lien unique, copiez-le ou partagez-le directement par email"
      services={servicesData}
      onCopy={handleCopy}
    />
  );
}

export default App;

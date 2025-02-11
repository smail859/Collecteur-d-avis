import CustomDatePicker from './CustomDatePicker'; // Importation du sélecteur de date personnalisé

// Composant principal qui intègre le sélecteur de date
function Date() {
  // Fonction qui sera appelée lorsque l'utilisateur sélectionne une date
  const handleDateChange = (date) => {
    console.log("Date sélectionnée :", date); // Affiche la date sélectionnée dans la console
  };

  return (
    <div>
      {/* Titre du filtre de date */}
      <h2>Filtrer les données par date :</h2>

      {/* Composant CustomDatePicker avec un callback pour récupérer la date */}
      <CustomDatePicker onDateChange={handleDateChange} />
    </div>
  );
}

export default Date; // Export du composant pour pouvoir l'utiliser ailleurs

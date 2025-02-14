import { Card, CardContent, Typography, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';


function StatCard() {


  const [nbrAvis, setNbrAvis] = useState(Math.random() * 2)

  useEffect(() => {
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    // Met à jour le nombre d'avis toutes les 5 secondes pour ensuite le faire a chaque appel API
    const interval = setInterval(() => {
      setNbrAvis(getRandomIntInclusive(0, 50000));
    }, 5000); // 5000 ms = 5 secondes
  
    return () => clearInterval(interval); // Nettoie l'intervalle quand le composant est démonté
  }, []);
  return (
    <Card
      variant="elevation"
      sx={{
        width: "100%",
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '16px',
        p: 2,
        boxShadow: 'none'
      }}
    >
      <CardContent>
        {/* Icône étoiles */}
        <Stack direction="row"  spacing={0.5} sx={{ mx: "auto", display: 'flex', justifyContent:"center", alignItems: 'center', mb: 2, backgroundColor: "#F2F3FB", width: "200px", maxHeight: "72px", padding: "20px", borderRadius: "20px"}}>
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} sx={{ color: '#FFA726', fontSize: '20px' }} />
          ))}
        </Stack>

        {/* Nombre d'avis collectés */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: '120px',
            background: 'linear-gradient(180deg, #2972FF -123%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {nbrAvis}
        </Typography>

        {/* Texte "Avis collectés" */}
        <Typography variant="subtitle1" sx={{ color: '#6366F1', fontWeight: '500', fontSize: "54px" }}>
          Avis collectés
        </Typography>

      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  interval: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['down', 'neutral', 'up']).isRequired,
  value: PropTypes.string.isRequired,
};


export default StatCard;

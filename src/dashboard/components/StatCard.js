import { Card, CardContent, Typography, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';
import useFetchReviews from "../../hooks/components/useFetchReviews"


function StatCard() {

  const { totalReviews } = useFetchReviews();
  /**
   * Recuperer l'ensemble des avis de tous les services
   * Calculer combien d'avis nous avons eu 
   * Afficher le nombre d'avis recoltés
  */


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
          {totalReviews}
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

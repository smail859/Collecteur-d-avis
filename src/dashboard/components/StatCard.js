import { Card, CardContent, Typography, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';


function StatCard() {
  return (
    <Card
      variant="elevation"
      sx={{
        width: "100%",
        textAlign: 'center',
        backgroundColor: '#F0F4FF',
        borderRadius: '16px',
        p: 2,
        boxShadow: 'none'
      }}
    >
      <CardContent>
        {/* Icône étoiles */}
        <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mb: 1 }}>
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} sx={{ color: '#FFA726', fontSize: '20px' }} />
          ))}
        </Stack>

        {/* Nombre d'avis collectés */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: '36px',
            background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          5 209
        </Typography>

        {/* Texte "Avis collectés" */}
        <Typography variant="subtitle1" sx={{ color: '#6366F1', fontWeight: '500' }}>
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

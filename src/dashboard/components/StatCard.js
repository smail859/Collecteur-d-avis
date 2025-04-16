import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PropTypes from 'prop-types';
import useFetchReviews from "../../hooks/components/useFetchReviews";

function StatCard() {
  const { totalReviews, loading } = useFetchReviews();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      variant="elevation"
      sx={{
        width: "100%",
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '16px',
        p: isMobile ? 2 : 4,
        boxShadow: 'none',
      }}
    >
      <CardContent>
        {/* Bloc étoiles */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            mx: "auto",
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            mb: isMobile ? 1 : 2,
            backgroundColor: "#F2F3FB",
            width: isMobile ? "150px" : "200px",
            height: isMobile ? "48px" : "72px",
            padding: isMobile ? "12px" : "20px",
            borderRadius: "20px"
          }}
        >
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} sx={{ color: '#FFA726', fontSize: isMobile ? '16px' : '20px' }} />
          ))}
        </Stack>

        {/* Nombre d’avis ou loader */}
        {loading ? (
          <CircularProgress size={isMobile ? 60 : 90} sx={{ my: 2 }} />
        ) : (
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: isMobile ? '60px' : '120px',
              background: 'linear-gradient(180deg, #2972FF -123%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {totalReviews}
          </Typography>
        )}

        {/* Titre */}
        <Typography
          variant="subtitle1"
          sx={{
            color: '#6366F1',
            fontWeight: '500',
            fontSize: isMobile ? '28px' : "54px"
          }}
        >
          Avis collectés
        </Typography>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  interval: PropTypes.string,
  title: PropTypes.string,
  trend: PropTypes.oneOf(['down', 'neutral', 'up']),
  value: PropTypes.string,
};

export default StatCard;

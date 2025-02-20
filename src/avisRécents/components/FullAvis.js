import { Card, CardContent, CardHeader, CardActions, Typography, Avatar, Stack, Link } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PropTypes from "prop-types";

const FullAvis = ({ avisData }) => {

  
  /**
   * Limiter le nombre de ligne par avis
   * Ajouter un bouton "Voir plus" pour voir l'avis completement dans une modal
  */

  return (
    <Card sx={{ 
      width: "350px", 
      minHeight: "200px",
      backgroundColor: '#F2F3FB', 
      borderRadius: '15px', 
      boxShadow: 2, 
      padding: 2,
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'space-between' 
    }}>
      {/* En-tête de l'avis */}
      <CardHeader
        avatar={<Avatar src={avisData.user.thumbnail} alt={avisData.user.name} />}
        title={
          <Link href={avisData.user.link} target="_blank" rel="noopener noreferrer" underline="none">
            {avisData.user.name}
          </Link>
        }
        subheader={avisData.date}
        sx={{ paddingBottom: 0 }}
      />

      {/* Contenu de l'avis */}
      <CardContent sx={{ paddingTop: 1, flexGrow: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {[...Array(avisData.rating)].map((_, i) => (
            <StarIcon key={i} sx={{ color: '#FFD700' }} />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {avisData.text}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <FolderOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />
            {avisData.link && (
              <Link href={avisData.link} target="_blank" rel="noopener noreferrer" underline="none" sx={{ color: '#8B5CF6', fontSize: '14px' }}>
                Voir l'avis sur Google
              </Link>
            )}
          </Stack>
        </Stack>
      </CardActions>
    </Card>
  );
};

// Validation avec PropTypes
FullAvis.propTypes = {
  avisData: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string,
      thumbnail: PropTypes.string,
      reviews_count: PropTypes.number,
      photos_count: PropTypes.number,
    }).isRequired,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string,
    likes: PropTypes.number,
  }).isRequired
};

export default FullAvis;

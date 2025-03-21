import { Card, Box, Typography, Rating, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from "prop-types";
import SouthEastOutlinedIcon from '@mui/icons-material/SouthEastOutlined';

const CustomLinearProgress = styled(LinearProgress)(() => ({
  height: "17px",
  borderRadius: 5,
  backgroundColor: "#E0E0E0",
  '& .MuiLinearProgress-bar': {
    borderRadius: "20px",
    background: "linear-gradient(180deg, #2972FF -123%, #8B5CF6 100%)",
  },
}));

const NoteParService = ({
  logo,
  labelService,
  noteService,
  nombreAvis,
  progress 
}) => {
  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "1599px",  
        height: "auto",
        padding: "34px",
        backgroundColor: '#F2F3FB',
        borderRadius: '20px',
        border: '1px solid #F2F3FB',
        margin: 'auto',
        marginBottom: '34px',
        boxShadow:" rgba(0, 0, 0, 0.10) 0px 1px 4px"
      }}
    >
      {/* Première Card */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        <Card sx={{ 
            height: "auto",
            width: 'auto',
            borderRadius: '15px', 
            boxShadow: 2, 
            display: 'flex',
            padding: '34px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '24px'
        }}>
            {/* Logo + Nom + Avis */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '70px', 
                  width: '70px',
              }}>
                <img src={logo} alt={labelService} style={{ width: "150px", height: "100px" }} />
              </Box>

              {/* Texte à côté du logo */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography fontWeight="bold" fontSize={"20px"}>{labelService}</Typography>
                  <Typography color="black" fontSize={"16px"}>{nombreAvis} avis</Typography>
              </Box>
            </Box>

            {/* Note + Étoiles */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: '54px', fontWeight: '800'}}>
                {noteService}
                <SouthEastOutlinedIcon sx={{ color: 'red', fontSize: "40px", marginLeft: '4px' }}/>
              </Typography>
              <Rating 
                name="half-rating-read" 
                value={parseFloat(noteService) || 0}
                precision={0.1} 
                readOnly 
                sx={{fontSize: "40px"}}
              />

            </Box>
        </Card>
      </Box>

      {/* Barre de progression des avis */}
      <Box sx={{
        width: '225%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {[5, 4, 3, 2, 1].map((note) => (
          <Box 
            key={note}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%'
            }}
          >
            {/* Icône étoile et note */}
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '62px',
                height: '48px',
                justifyContent: 'center',
                textAlign: 'center',
                borderRadius: '20px',
                backgroundColor: 'white', 
              }}
            >
              <StarIcon sx={{ color: 'gold', width: '20px', height: '20px' }} />
              <Typography sx={{ fontSize: '18px', fontWeight: '700', minWidth: '30px' }}>
                {note}
              </Typography>
            </Box>
            <CustomLinearProgress 
              variant="determinate" 
              value={parseInt(progress?.[note] || 0)} 
              sx={{ flexGrow: 1 }} 
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              borderRadius: '20px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
            }}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600',                
                display: 'flex',
                alignItems: 'center',
                width: '63px',
                height: '48px',
                justifyContent: 'center',
                textAlign: 'center',
                borderRadius: '20px',
                backgroundColor: 'white',  }}>
                {progress?.[note] || 0}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

NoteParService.propTypes = {
  logo: PropTypes.string,
  labelService: PropTypes.string,
  noteService: PropTypes.shape({
    google: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  }), 
  nombreAvis : PropTypes.number,
  progress: PropTypes.object 
};

export default NoteParService;

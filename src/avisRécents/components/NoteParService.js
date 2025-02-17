import { Card, Box, Typography, Rating, LinearProgress} from '@mui/material';
import { styled } from '@mui/material/styles';
import SouthEastOutlinedIcon from '@mui/icons-material/SouthEastOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { useState } from "react";
import PropTypes from "prop-types";

const CustomLinearProgress = styled(LinearProgress)(() => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    '& .MuiLinearProgress-bar': {
      borderRadius: 5,
      backgroundImage: 'linear-gradient(to right, #1CB5E0, #e01cd5)',
    },
}));

const NoteParService = ({logo, labelService, noteService, nombreAvis }) => {
  const [progress, setProgress] = useState({
    5: 68,
    4: 4,
    3: 0,
    2: 0,
    1: 28
  });

  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "1300px",  
        height: "auto",
        padding: "34px",
        backgroundColor: '#F2F3FB',
        borderRadius: '20px',
        border: '1px solid #F2F3FB',
        margin: 'auto',
        marginBottom: '34px',
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
                  <Typography fontWeight="bold">{labelService}</Typography>
                  <Typography color="black">{nombreAvis} avis</Typography>
              </Box>
            </Box>

            {/* Note + Étoiles */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
            <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: '54px', fontWeight: '800'}}>
              {noteService}
                <SouthEastOutlinedIcon sx={{ color: 'red', width: '32px', height: '32px', marginLeft: '4px' }}/>
            </Typography>
            <Rating name="half-rating-read" defaultValue={4.8} precision={0.5} readOnly />
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
                width: '63px',
                height: '48px',
                justifyContent: 'center',
                textAlign: 'center',
                borderRadius: '20px',
                backgroundColor: note === 4 ? '#7C4DFF' : 'white', 
              }}
            >
              <StarBorderOutlinedIcon sx={{ color: note === 4 ? 'white' : 'gold', width: '20px', height: '20px' }} />
              <Typography sx={{ fontSize: '18px', fontWeight: '700', minWidth: '30px', color: note === 4 ? 'white' : 'black', }}>
                {note}
              </Typography>
            </Box>
            <CustomLinearProgress variant="determinate" value={progress[note]} sx={{ flexGrow: 1 }} />
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
                {progress[note]}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
    
  );
};


// Validation avec PropTypes
NoteParService.propTypes = {
  logo: PropTypes.string,
  labelService: PropTypes.string,
  noteService: PropTypes.number, 
  nombreAvis : PropTypes.number,
};

  
export default NoteParService;

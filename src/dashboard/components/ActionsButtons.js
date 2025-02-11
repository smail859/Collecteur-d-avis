import * as React from 'react';
import { Box, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';

export default function ActionButtons({ onFirstClick, onSecondClick }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', // Permet d'avoir les boutons l'un sous l'autre
        alignItems: 'flex-end',  // Alignement à droite
        gap: 2, 
        mt: 2 
      }}
    >
      {/* Premier bouton */}
      <Button
        variant="text"
        endIcon={<CalendarTodayIcon />}
        sx={{
          color: '#121826',
          backgroundColor: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        onClick={onFirstClick}
      >
        Voir les avis récents
      </Button>

      {/* Deuxième bouton */}
      <Button
        variant="outlined"
        endIcon={<AddIcon />}
        sx={{
          backgroundColor: '#6B5BFF',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0px 4px 10px rgba(107, 91, 255, 0.3)',
          '&:hover': { backgroundColor: '#5948c4' },
        }}
        onClick={onSecondClick}
      >
        Collecter un avis
      </Button>
    </Box>
  );
}

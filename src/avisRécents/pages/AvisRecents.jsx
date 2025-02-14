import { 
    Chip, Stack, 
    Box, Typography,
} from '@mui/material';

import FaceIcon from '@mui/icons-material/Face';
import FullAvis from "../components/FullAvis"
import NoteParService from "../components/NoteParService"

const AvisRecents = () => {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <Box maxWidth="100%" mx="auto" bgcolor= '#F5F7FF' >
        <Typography fontSize="54px" fontWeight="900" textAlign="start" ml="20px" gutterBottom>
            Avis Recents
        </Typography>
        <Typography fontSize="16px" fontWeight="bold" textAlign="start" ml="20px" mb="40px" color='#8B5CF6' gutterBottom>
            Suivez les derniers retours de nos utilisateurs
        </Typography>

        {/* Conteneur des Chips */}
        <Stack 
            direction="row" 
            spacing={2} 
            sx={{  
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mt: 10, 
                padding: '20px', 
                borderRadius: '20px',
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            <Box sx={{ 
                backgroundColor: "black", 
                padding: '7px',
                borderRadius: '15px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3, 
            }}>
                {/* Liste des Chips */}
                {["MonBien", "Startloc", "Sinimo", "PigeOnline", "Marketing immobilier", "Marketing Automobile", "Sav"].map((label) => (
                    <Chip 
                        key={label}
                        sx={{ 
                            padding: '20px',

                            backgroundColor: 'white', 
                            color: 'black', 
                            boxShadow: 1, 
                            borderRadius: '15px',
                            '&:hover': { backgroundColor: '#F0E8FF' }
                        }} 
                        label={label} 
                        icon={<FaceIcon />} 
                        onClick={handleClick} 
                    />
                ))}
                
            </Box>
            <NoteParService/>
            <FullAvis/>
        </Stack>
    </Box>
  );
}

export default AvisRecents;

import { 
    Chip, Stack, 
    Box, Typography,
} from '@mui/material';

import FaceIcon from '@mui/icons-material/Face';

const AvisRecents = () => {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <Box maxWidth="1400px" mx="auto" p={2} >
        <Typography fontSize="54px" fontWeight="900" textAlign="start" ml="20px" gutterBottom>
            Collecter des avis
        </Typography>
        <Typography fontSize="16px" fontWeight="bold" textAlign="start" ml="20px" mb="40px" color='#8B5CF6' gutterBottom>
            Générez un lien unique, copiez-le ou partagez-le directement par email
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
        </Stack>
    </Box>
  );
}

export default AvisRecents;

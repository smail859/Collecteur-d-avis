import { 
    Chip, Stack, 
    Box,
} from '@mui/material';

import MONBIEN from "../../image/MONBIEN.png";

const ListChip = () => {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <Box maxWidth="1400px" mx="auto" p={2} >
        {/* Conteneur des Chips */}
        <Stack 
            direction="row" 
            spacing={2} 
            sx={{  
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                                flexWrap: "wrap", 
                mt: 10, 
                padding: '20px', 
                borderRadius: '20px',
                gap: 2,
            }}
        >
            <Box sx={{ 
                backgroundColor: '#F2F3FB',
                padding: '7px',
                borderRadius: '15px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3, 
            }}>
                {/* Liste des Chips */}
                {["MonBien", "Startloc", "Sinimo", "PigeOnline", "Marketing immobilier", "Marketing Automobile", "SAV"].map((label) => (
                    <Chip 
                        key={label}
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'flex-start', // Aligner le contenu à gauche
                            textAlign: 'left', // Alignement du texte à gauche
                            padding: '25px',
                            color: 'black', 
                            backgroundColor: 'white',
                            boxShadow: 1, 
                            gap: '9px',
                            borderRadius: '20px',
                            paddingRight: '10px',
                            width: 'auto', // Permet au Chip de s'ajuster au texte
                            "& .MuiChip-label": { 
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: "5px", // Réduit l'espace entre l'image et le texte
                                padding: 0, // Supprime tout padding inutile
                                margin: 0, 
                            },
                            paddingLeft: '1px', // Ajoute un léger décalage à gauche
                            fontFamily: 'sans-serif',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: '150%' /* 24px */

                            
                        }} 
                        label={label} 
                        icon={<img src={MONBIEN} alt="MonBien" />} 
                        onClick={handleClick} 
                    />
                ))}
            </Box>
        </Stack>
    </Box>
  );
}

export default ListChip;

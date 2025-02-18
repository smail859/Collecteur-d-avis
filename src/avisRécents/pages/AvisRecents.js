import { 
    Stack, 
    Box, Typography,
} from '@mui/material';

import {useState} from 'react'

import FullAvis from "../components/FullAvis"
import NoteParService from "../components/NoteParService"
import ListChip from '../components/ListChip';
import MONBIEN from "../../image/MONBIEN.png"
import STARTLOC from "../../image/STARTLOC.png"
import MARKETINGAUTO from "../../image/MARKETINGAUTO.png"
import MARKETINGIMMO from "../../image/MARKETINGIMMO.png"
import SINIMO from "../../image/SINIMO.png"
import PIGEONLINE from "../../image/PIGEONLINE.png"
const AvisRecents = ({onFilterChange}) => {

    const [selected, setSelected] = useState()

    const handleServiceChange = (newService) => {
        if (newService !== null) {
            setSelected(newService);
            if (typeof onFilterChange === "function") {
                onFilterChange(newService);
            } else {
                console.warn("onFilterChange is not a function");
            }
        }
    };
    
    const servicesChip = [
        {
          label: "Monbien",
          icon: MONBIEN, 
        },
        {
          label: "Startloc",
          icon: STARTLOC,
        },
        {
          label: "Sinimo",
          icon: SINIMO,
        },
        {
          label: "Pige Online",
          icon: PIGEONLINE,
        },
        {
          label: "Marketing Immobilier",
          icon: MARKETINGIMMO,
        },
        {
          label: "Marketing Automobile",
          icon: MARKETINGAUTO,
        },
        {
          label: "Sav",
          icon: MARKETINGIMMO,
        },
    ];
      

  return (
    <Box maxWidth="1400px" mx="auto">
        <Typography fontSize="54px" fontWeight="900" textAlign="start"  mt="20px" gutterBottom>
            Avis Recents
        </Typography>
        <Typography fontSize="16px" fontWeight="bold" textAlign="start" mt="20px" color='#8B5CF6' gutterBottom>
            Suivez les derniers retours de nos utilisateurs
        </Typography>

        <Stack 
            direction="row" 
            spacing={4} 
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
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <ListChip servicesChip={servicesChip} handleServiceChange={handleServiceChange} selected={selected} />
            </Box>

            <NoteParService logo={MONBIEN} labelService={"Monbien"} noteService={'4.8'} nombreAvis={"1 004"}/>
            <FullAvis/>
        </Stack>
    </Box>
  );
}

export default AvisRecents;

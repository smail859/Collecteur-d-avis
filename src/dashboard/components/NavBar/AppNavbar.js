import { useState } from 'react';
import NavLinks from './NavLinks';

// MUI Components
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';

// MUI Icons
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';


// Custom Components
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import CustomDatePicker from './CustomDatePicker';
import icon from '../../../image/icon.png';

// Styled Toolbar
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  width: '95%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
}));

const links = [
  { path: "/", label: "Tableau de bord" },
  { path: "/avisRecents", label: "Avis récents" },
  { path: "/collecterAvis", label: "Collecter des avis" },
  { path: "/statistiques", label: "Statistiques" },
];

export default function AppNavbar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'white',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <StyledToolbar>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={icon} alt="Logo" style={{ height: '50px', marginLeft: '100px' }} />
        </Box>

        {/* Center Section - Navigation Links */}
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center'}}>
          
          {links.map((link) => (
              <NavLinks label={link.label} path={link.path} />
            ))}

        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CustomDatePicker />
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
          <Person2OutlinedIcon 
            sx={{ 
              fontSize: 30,            
              background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
              color: 'white',          
              borderRadius: '20px',     
              padding: '8px'           
            }} 
          />
          <Typography sx={{ color: '#121826', fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px' }}>
            Smaïl El Hajjar
          </Typography>
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Box>
      </StyledToolbar>
    </AppBar>
  );
}

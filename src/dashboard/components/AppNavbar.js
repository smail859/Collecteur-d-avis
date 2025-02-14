import * as React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

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

// MUI Classes
import { tabsClasses } from '@mui/material/Tabs';

// Custom Components
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import CustomDatePicker from './CustomDatePicker';
import icon from '../../image/icon.png';

// Styled Toolbar
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
}));

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src={icon} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
          <Typography variant="h5" component="h1" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Dashboard
          </Typography>
        </Box>

        {/* Center Section - Navigation Links */}
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexGrow: 1 }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '18px'
            })}
          >
            Tableau de bord
          </NavLink>
          <NavLink
            to="/avisRecents"
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '18px'
            })}
          >
            Avis récents
          </NavLink>
          <NavLink
            to="/collecterAvis"
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '18px'
            })}
          >
            Collecter des avis
          </NavLink>
          <NavLink
            to="/statistiques"
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '18px'
            })}
          >
            Statistiques
          </NavLink>

        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CustomDatePicker />
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
          <ColorModeIconDropdown />
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

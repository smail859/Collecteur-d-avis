<<<<<<< HEAD
import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
=======
// React
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
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';

// MUI Classes
import { tabsClasses } from '@mui/material/Tabs';

// Custom Components
import SideMenuMobile from '../../components-not-use/SideMenuMobile';
import MenuButton from './MenuButton';
import icon from '../../image/icon.png';
import CustomDatePicker from './CustomDatePicker';

// Styles for Toolbar
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(5),
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

const AppNavbar = () => {
  // State Management
  const [open, setOpen] = useState(false);

  // Toggle Drawer
  const toggleDrawer = (newOpen) => {
    return () => setOpen(newOpen);
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
  };

  return (
    <AppBar
<<<<<<< HEAD
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
=======
      position="static"
      sx={{
        bgcolor: 'white',
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
<<<<<<< HEAD
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mr: 'auto' }}
          >
            <CustomIcon />
            <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
              Dashboard
            </Typography>
          </Stack>
          <ColorModeIconDropdown />
=======
      <StyledToolbar>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={icon} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
        </Box>

        {/* Center Section - Navigation Links */}
        <Box sx={{ display: 'flex', gap: 10, justifyContent: 'center', flexGrow: 1 }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '20px'
            })}
          >
            Tableau de bord
          </NavLink>
          <NavLink
            to="/services"
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '20px'
            })}
          >
            Avis récents
          </NavLink>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              color: isActive ? '#8B5CF6' : '#121826',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '20px'
            })}
          >
            Statistiques
          </NavLink>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          <CustomDatePicker />
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
<<<<<<< HEAD
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CustomIcon() {
  return (
    <Box
      sx={{
        width: '1.5rem',
        height: '1.5rem',
        bgcolor: 'black',
        borderRadius: '999px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundImage:
          'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
        color: 'hsla(210, 100%, 95%, 0.9)',
        border: '1px solid',
        borderColor: 'hsl(210, 100%, 55%)',
        boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)',
      }}
    >
      <DashboardRoundedIcon color="inherit" sx={{ fontSize: '1rem' }} />
    </Box>
  );
}
=======
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default AppNavbar;
>>>>>>> 60ff468 (Reconnecté au repo GitHub)

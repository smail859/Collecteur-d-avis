import React from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import icon from '../../image/icon.png';
import AddIcon from '@mui/icons-material/Add';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const Footer = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 1}}> 
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', maxWidth: "100%", height: "150px" }}>
          
          {/* Logo à gauche */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={icon} alt="Logo" style={{ height: '50px' }} />
          </Box>

          {/* Liens à droite avec une marge */}
          <Box sx={{ display: 'flex', gap: 10, ml: 'auto', mr: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                {/* Tableau de Bord */}
                <NavLink
                    to="/"
                    style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: isActive ? '#8B5CF6' : '#121826',
                    fontWeight: '600',
                    fontSize: '16px',
                    })}
                >
                    <HomeOutlinedIcon 
                    sx={{ 
                        fontSize: '45px',
                        background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
                        color: 'white',  
                        borderRadius: '50%', 
                        padding: '8px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} 
                    />
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
                        Tableau de Bord
                    </Typography>
                </NavLink>

                {/* Collecter un avis */}
                <NavLink
                    to="collecterAvis"
                    style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: isActive ? '#8B5CF6' : '#121826',
                    fontWeight: '600',
                    fontSize: '16px',
                    })}
                >
                    <AddIcon
                    sx={{ 
                        fontSize: '45px',
                        background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
                        color: 'white',  
                        borderRadius: '50%', 
                        padding: '8px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}  
                    />
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
                        Collecter un avis
                    </Typography>
                </NavLink>
                {/* Avis récents */}
                <NavLink
                    to="/fullAvis"
                    style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: isActive ? '#8B5CF6' : '#121826',
                    fontWeight: '600',
                    fontSize: '16px',
                    })}
                >
                    <CalendarMonthOutlinedIcon
                    sx={{ 
                        fontSize: '45px',
                        background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
                        color: 'white',  
                        borderRadius: '50%', 
                        padding: '8px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}  
                    />
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
                    Avis récents
                    </Typography>
                </NavLink>
            </Box>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Footer;

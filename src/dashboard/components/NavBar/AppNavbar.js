import { useState,useEffect } from 'react';
import NavLinks from './NavLinks';

// MUI Components
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Badge,
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
import NotificationDrawer from "./NotificationDrawer"
import useFetchReviews from '../../../hooks/components/useFetchReviews';

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

export default function AppNavbar({ darkMode, onToggleDarkMode }) {
  const [open, setOpen] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [notifCleared, setNotifCleared] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { newReviewsCount, updateLastCheckDate, newReviews, detectCommercialName } = useFetchReviews({ notifCleared });


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleNotifOpen = () => {
    setOpenNotif(true);
  };
  

  const handleNotifClose = () => {
    updateLastCheckDate();
    setNotifCleared(true);
    setOpenNotif(false);
  };
  

  useEffect(() => {
    if (!openNotif) {
      const timeout = setTimeout(() => {
        setNotifCleared(false);
      }, 1000); // petite latence pour laisser le temps au hook de se recalculer
  
      return () => clearTimeout(timeout);
    }
  }, [openNotif]);
  
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: darkMode ? theme.palette.grey[900] : theme.palette.background.paper,
        color: darkMode ? theme.palette.text.primary : theme.palette.text.secondary,
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
        top: 'var(--template-frame-height, 0px)',
        boxShadow: "none",
        width: '100%', 
      }}
    >
      <StyledToolbar>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={icon} alt="Logo" style={{ height: '50px', marginLeft: '100px' }} />
        </Box>

        {/* Center Section - Navigation Links */}
        {isDesktop && (
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {links.map((link) => (
              <NavLinks key={link.path} label={link.label} path={link.path} />
            ))}
          </Box>
        )}

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isDesktop ? (
            <>
              <CustomDatePicker />
              <MenuButton onClick={handleNotifOpen}>
              <Badge
                color="error"
                badgeContent={newReviewsCount > 0 ? newReviewsCount : null}
              >
                <NotificationsRoundedIcon />
              </Badge>
              </MenuButton>
              

              <Person2OutlinedIcon
                sx={{
                  fontSize: 30,
                  background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
                  color: 'white',
                  borderRadius: '20px',
                  padding: '8px',
                }}
              />
              <Typography sx={{
                color: theme.palette.text.primary,
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '16px'
              }}>
                Smaïl El Hajjar
              </Typography>
            </>
          ) : (
            <>
              <MenuButton aria-label="menu" onClick={() => setOpen(true)}>
                <MenuRoundedIcon />
              </MenuButton>
            </>
          )}
        </Box>
      </StyledToolbar>
      {/* Drawer uniquement pour desktop */}
      {isDesktop && (
        <NotificationDrawer open={openNotif} onClose={handleNotifClose} newReviews={newReviews} detectCommercialName={detectCommercialName} />
      )}
    

      {/* Drawer uniquement pour mobile */}
      <SideMenuMobile
        open={open}
        toggleDrawer={toggleDrawer}
        links={links}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
    </AppBar>
  );
}

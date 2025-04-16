import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavLinks from './NavLinks';
import MenuButton from './MenuButton';

const links = [
  { path: "/", label: "Tableau de bord" },
  { path: "/avisRecents", label: "Avis récents" },
  { path: "/collecterAvis", label: "Collecter des avis" },
  { path: "/statistiques", label: "Statistiques" },
];


function SideMenuMobile({ open, toggleDrawer }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '50%',
        }}
      >
        <Stack direction="row" sx={{ p: 5, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt="Smaïl El Hajjar"
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />
            <Typography component="p" variant="h6">
              Smaïl El Hajjar
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
          {/* Liens de navigation */}
          <Stack spacing={2} sx={{ mt: 2 }}>
            {links.map((link) => (
              <NavLinks key={link.path} label={link.label} path={link.path} />
            ))}
        </Stack>
      </Stack>
    </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
};

export default SideMenuMobile;

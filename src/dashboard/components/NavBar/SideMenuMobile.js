import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import {Typography,Stack, Box} from '@mui/material';
import NavLinks from './NavLinks';
import useFetchReviews from '../../../hooks/components/useFetchReviews';


const links = [
  { path: "/", label: "Tableau de bord" },
  { path: "/avisRecents", label: "Avis récents" },
  { path: "/collecterAvis", label: "Collecter des avis" },
  { path: "/statistiques", label: "Statistiques" },
];

function SideMenuMobile({ open, toggleDrawer, newReviews}) {
  const { detectCommercialName } = useFetchReviews();

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
        </Stack>
        <Divider />
          {/* Liens de navigation */}
          <Stack spacing={2} sx={{ mt: 2 }}>
            {links.map((link) => (
              <NavLinks key={link.path} label={link.label} path={link.path} />
            ))}
        </Stack>
        <Stack sx={{display: "flex", justifyContent: "center", alignItems: "center", mt: 2}}>
          <Divider />
          {Array.isArray(newReviews) && newReviews.length > 0 ? (
            newReviews.slice(0, 5).map((review, index) => {
              const commercial = detectCommercialName(review.text || "", review.service);
              return (
                <Box key={index} sx={{ p: 1, bgcolor: "#F2F3FB", borderRadius: 2 }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                    {review.service} {commercial && `– ${commercial}`}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                    {review.text.length > 1000
                      ? `${review.text.substring(0, 50)}...`
                      : review.text
                    }
                   
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
              Aucun nouvel avis
            </Typography>
          )}
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

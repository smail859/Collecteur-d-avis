// components/layout/NotificationDrawer.js
import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Divider,
} from '@mui/material';

const NotificationDrawer = ({ open, onClose, newReviews }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        '& .MuiDrawer-paper': {
          width: '300px',
          padding: 2,
          backgroundColor: '#fff',
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        🛎️ Nouveaux avis
      </Typography>
      <Divider />
      {newReviews?.length > 0 ? (
        <Stack spacing={2} mt={2}>
          {newReviews.slice(0, 5).map((review, index) => (
            <Box key={index} sx={{ p: 2, bgcolor: "#F2F3FB", borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                {review.service}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {review.text.slice(0, 60)}...
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Aucun nouvel avis.
        </Typography>
      )}
    </Drawer>
  );
};

NotificationDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newReviews: PropTypes.array.isRequired,
};

export default NotificationDrawer;

import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const NotificationDrawer = ({ open, onClose, newReviews, detectCommercialName }) => {

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        '& .MuiDrawer-paper': {
          width: '320px',
          padding: 2,
          backgroundColor: '#FAFAFA',
        },
      }}
    >

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">🛎️ Nouveaux avis</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <Stack spacing={2} mt={2}>
        {newReviews.slice(0, 5).map((review, index) => {
          const text = review.text || review.snippet || "";
          const commercial = detectCommercialName(text, review.service);

          return (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                boxShadow: 1,
                transition: "all 0.2s ease",
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" fontWeight={600}>
                  {review.service}
                </Typography>
                {commercial && (
                  <Chip
                    label={commercial}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '12px' }}
                  />
                )}
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {text}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Drawer>
  );
};

NotificationDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newReviews: PropTypes.array.isRequired,
};

export default NotificationDrawer;

import PropTypes from 'prop-types';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';

/**
 * Composant réutilisable pour afficher une liste de boutons d'action.
 */
export default function ActionButtons({ buttons = [], sx = {}, containerProps = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) return null; // Affichage désactivé sur mobile

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexDirection: 'column',
        alignItems: 'flex-end',
        ...sx
      }}
      {...containerProps}
    >
      {buttons.map((btn, index) => (
        <Button
          key={index}
          variant={btn.variant || "text"}
          endIcon={btn.icon || <AcUnitIcon />}
          sx={{
            color: btn.color || 'white',
            backgroundColor: btn.bgColor || 'white',
            padding: '12px 24px',
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: btn.boxShadow || '5px 2px 4px rgba(0, 0, 0, 0.1)',
            fontSize: "16px",
            ...btn.sx
          }}
          onClick={btn.onClick}
        >
          {btn.label}
        </Button>
      ))}
    </Box>
  );
}

ActionButtons.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.element,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.oneOf(["text", "outlined", "contained"]),
      color: PropTypes.string,
      bgColor: PropTypes.string,
      hoverColor: PropTypes.string,
      boxShadow: PropTypes.string,
      sx: PropTypes.object,
    })
  ),
  sx: PropTypes.object,
  containerProps: PropTypes.object,
};

import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';

/**
 * Composant réutilisable pour afficher une liste de boutons d'action.
 * @param {Array} buttons - Liste des boutons (label, icon, onClick, variant, styles).
 * @param {Object} sx - Styles personnalisés pour le conteneur.
 * @param {Object} containerProps - Autres props pour le conteneur.
 */

export default function ActionButtons({ buttons = [], sx = {}, containerProps = {} }) {
  return (
    <Box 
      sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'flex-end', ...sx }} 
      {...containerProps} 
    >
      {buttons.map((btn, index) => (
        <Button
          key={index}
          variant={btn.variant || "text"}
          endIcon={btn.icon || <AcUnitIcon/>}
          sx={{
            color: btn.color || '#121826',
            backgroundColor: btn.bgColor || 'white',
            padding: '12px 24px',
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: btn.boxShadow || '5px 2px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': { backgroundColor: btn.hoverColor || btn.bgColor },
            fontSize: "16px", // (optionnel) Ajuste la taille du texte
            ...btn.sx // Permet d'ajouter des styles spécifiques au bouton
          }}
          onClick={btn.onClick}
        >
          {btn.label}
        </Button>
      ))}
    </Box>
  );
}

// 🔹 Validation avec PropTypes
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
      sx: PropTypes.object // Ajout pour les styles spécifiques aux boutons
    })
  ),
  sx: PropTypes.object, // Pour personnaliser la `Box`
  containerProps: PropTypes.object // Pour ajouter des props supplémentaires sur la `Box`
};

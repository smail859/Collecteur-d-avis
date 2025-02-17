import { Chip, Stack, Box } from "@mui/material";
import PropTypes from "prop-types";

const ListChip = ({ servicesChip, handleServiceChange, selected }) => {
  return (
    <Box maxWidth="100%" mx="auto" p={2}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            maxWidth: "1400px",
            backgroundColor: "#F2F3FB",
            padding: '7px',
            borderRadius: '15px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3, 
          }}
        >
          {servicesChip.map((service) => (
            <Chip
                key={service.label}
                label={service.label}
                icon={
                service.icon ? (
                    <img
                    src={service.icon}
                    alt={service.label}
                    style={{
                        width: 20,
                        height: 20,
                        marginRight: 8,
                    }}
                    />
                ) : null
                }
                onClick={() => handleServiceChange(service.label)}
                sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "20px 20px",
                color: selected === service.label ? "white" : "black",
                backgroundColor: selected === service.label ? "#8B5CF6" : "white",
                boxShadow: 1,
                borderRadius: "15px",
                "& .MuiChip-label": {
                    display: "flex",
                    alignItems: "center", // Assurer l'alignement du texte avec l'icône
                    gap: "5px", // Ajouter un espacement entre l'icône et le texte
                    padding: 0,
                    margin: 0,
                },
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "150%",
                }}
            />
            
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

// Validation avec PropTypes
ListChip.propTypes = {
  servicesChip: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string, // Utilisation de string pour les images
    })
  ).isRequired,
  handleServiceChange: PropTypes.func.isRequired,
  selected: PropTypes.string, // Ajout du prop pour suivre l'état actif
};

ListChip.defaultProps = {
    servicesChip: [],
};
  

export default ListChip;

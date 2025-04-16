import  {useState} from "react";
import { Chip, Stack, Box,useMediaQuery, useTheme} from "@mui/material";
import PropTypes from "prop-types";
import CustomDropdown from "./CustomDropdown";


const ListChip = ({ servicesChip, handleServiceChange, selected, sx, variant, handleCommercialChange, selectedService }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedValues, setSelectedValues] = useState(
    servicesChip.reduce((acc, service) => {
      acc[service.label] = ""; // On commence sans commercial sélectionné
      return acc;
    }, {})
  );

  const handleSelection = (serviceLabel, newValue) => {
    setSelectedValues({
      [serviceLabel]: newValue, // Réinitialise toutes les autres sélections
    });
    handleCommercialChange(serviceLabel, newValue);
    setOpenDropdown(null); // Ferme le dropdown après sélection
  };



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
            maxWidth: isMobile ? "100%" : "1600px",
            padding: "7px",
            borderRadius: "15px",
            display: "flex",
            flexDirection : isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: 1,
            ...sx,
          }}
        >
          {/*Mode Chip pour NoteParService*/}
          {variant === "chip" &&
            servicesChip.map((service) => (
              <Chip
                key={service.label}
                label={service.label}
                icon={
                  typeof service.icon === "string" ? (
                    <img
                      src={service.icon}
                      alt={service.label}
                      style={{
                        width: "38px",
                        height: "38px",
                        marginRight: 8,
                      }}
                    />
                  ) : service.icon
                }
                onClick={() => handleServiceChange(service.label)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "auto",
                  height: "auto",
                  padding: "7px",
                  color: selected === service.label ? "white" : "black",
                  backgroundImage: selected === service.label 
                    ? "linear-gradient(180deg, #2972FF -123%, #8B5CF6 100%)" 
                    : "none",
                  backgroundColor: selected === service.label ? "white" : "white",
                  "&:hover": {
                    backgroundColor: selected === service.label ? "transparent" : "white",
                    boxShadow: 3, // Garde l'ombre mais empêche le changement de couleur
                  },
                  
                  boxShadow: 1,
                  borderRadius: "20px",
                  "& .MuiChip-label": {
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: 0,
                    margin: 0,
                  },
                  fontSize: "16px",
                  fontWeight: "400",
                  lineHeight: "150%",
                  "& .MuiChip-icon": { marginRight: "8px" },
                }}
              />
            ))} 

           {/* Mode Select avec le dropdown animé */}
          {variant === "select" &&
            servicesChip.map((service) => (
              <div
                key={service.label}
                style={{
                  backgroundColor: selected === service.label ? "#8B5CF6" : "white",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  padding: "7px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  borderRadius: "20px",
                }}
              >
                {typeof service.icon === "string" ? (
                  <img src={service.icon} alt={service.label} style={{ width: 30, height: 30, marginRight: 8 }} />
                ) : (
                  service.icon
                )}

                <CustomDropdown
                  label={service.label}
                  options={service.commerciaux.map(c => ({ label: c, value: c }))}
                  value={selectedValues[service.label] || ""}
                  isOpen={openDropdown === service.label}
                  onChange={(newValue) => handleSelection(service.label, newValue)}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === service.label ? null : service.label)
                  }
                />
              </div>
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
      icon: PropTypes.node,
      commerciaux: PropTypes.arrayOf(PropTypes.string).isRequired,
      selectedCommercial: PropTypes.string, // Ajout de la prop pour le commercial sélectionné
    })
  ).isRequired,
  handleServiceChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
  sx: PropTypes.object,
  variant: PropTypes.oneOf(["chip", "select"]),
};

// Valeurs par défaut
ListChip.defaultProps = {
  servicesChip: [],
  variant: "chip",
  selected: "",
};

export default ListChip;
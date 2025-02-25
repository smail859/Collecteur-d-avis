import { Chip, Stack, Box, MenuItem, Select, FormControl } from "@mui/material";
import PropTypes from "prop-types";

const ListChip = ({ servicesChip, handleServiceChange, selected, sx, variant, handleCommercialChange, selectedService }) => {
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
            padding: "7px",
            borderRadius: "15px",
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            ...sx,
          }}
        >
          {/* 🔥 Mode Chip */}
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
                        width: 20,
                        height: 20,
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
                  padding: "20px 20px",
                  color: selected === service.label ? "white" : "black",
                  backgroundColor: selected === service.label ? "#8B5CF6" : "white",
                  boxShadow: 1,
                  borderRadius: "15px",
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

          {/* 🔥 Mode Select avec commerciaux */}
          {variant === "select" &&
            servicesChip.map((service) => (
              <FormControl
                key={service.label}
                sx={{
                  minWidth: 150,
                  backgroundColor: selected === service.label ? "#8B5CF6" : "white",
                  borderRadius: "15px",
                  boxShadow: 1,
                }}
              >
                <Select
                  value={selected === service.label ? service.selectedCommercial : ""}
                  onChange={(e) => handleCommercialChange(selectedService, e.target.value)} // ✅ Utilise handleCommercialChange
                  displayEmpty
                  sx={{
                    borderRadius: "15px",
                    fontSize: "16px",
                    fontWeight: "400",
                    color: selected === service.label ? "white" : "black",
                    backgroundColor: selected === service.label ? "#8B5CF6" : "white",
                    "& .MuiSelect-icon": { color: selected === service.label ? "white" : "#8B5CF6" },
                  }}
                  renderValue={(selectedValue) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {typeof service.icon === "string" ? (
                        <img src={service.icon} alt={service.label} style={{ width: 30, height: 30 }} />
                      ) : service.icon}
                      {selectedValue || service.label}
                    </Box>
                  )}
                >
                  <MenuItem value="" disabled>
                    {service.label}
                  </MenuItem>
                  {service.commerciaux.map((commercial) => (
                    <MenuItem key={commercial} value={commercial}>
                      {commercial}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
      selectedCommercial: PropTypes.string, // 🔥 Ajout de la prop pour le commercial sélectionné
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

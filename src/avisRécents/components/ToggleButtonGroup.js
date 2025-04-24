import { useState } from "react";
import CustomDropdown from "./CustomDropdown";
import { useMediaQuery, useTheme } from "@mui/material";

const ToggleButtonGroup = ({ filters, onFilterChange }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
        marginLeft: "22px"
      }}
    >
  
      {filters.map(({ key, label, options, value }) => (
        <CustomDropdown
          key={key}
          label={label}
          options={options}
          value={value}
          isOpen={openDropdown === key}
          onChange={(newValue) => onFilterChange(key, newValue)}
          onToggle={() => setOpenDropdown(openDropdown === key ? null : key)} // Gère l'ouverture/fermeture
          sx={{backgroundColor: "#F2F3FB"}}
        />
      ))}
    </div>
  );
};



export default ToggleButtonGroup;
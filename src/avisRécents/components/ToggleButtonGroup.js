import { useState } from "react";
import CustomDropdown from "./CustomDropdown";

const ToggleButtonGroup = ({ filters, onFilterChange }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px",  }}>
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
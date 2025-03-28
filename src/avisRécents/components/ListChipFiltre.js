import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";

const ListChipFiltre = ({ filters, onChangeFilters, dataFilters }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      {dataFilters.map(({ name, label, options }) => (
        <CustomDropdown
          key={name}
          label={label}
          options={options}
          value={filters[name] || options[0].value}
          isOpen={openDropdown === name}
          onChange={(newValue) => onChangeFilters({ ...filters, [name]: newValue })}
          onToggle={() => setOpenDropdown(openDropdown === name ? null : name)}
          sx={{backgroundColor: "#F2F3FB", borderRadius: "20px", padding: "14px", display: "flex", alignItems: "center"}}
        />
      ))}
    </div>
  );
};

export default ListChipFiltre;
import React, { useState } from "react";

const ListChipFiltre = ({ filters, onChangeFilters, dataFilters }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px"}}>
      {dataFilters.map(({ name, label, options }) => (
        <CustomDropdown
          key={name}
          label={label}
          options={options}
          value={filters[name] || options[0]}
          isOpen={openDropdown === name}
          onChange={(newValue) => onChangeFilters({ ...filters, [name]: newValue })}
          onToggle={() => setOpenDropdown(openDropdown === name ? null : name)} // Ferme l'autre dropdown
        />
      ))}
    </div>
  );
};

const CustomDropdown = ({ label, options, value, isOpen, onChange, onToggle }) => {
  const selectOption = (selectedValue) => {
    onChange(selectedValue);
    onToggle(); // Ferme le menu après sélection
  };

  return (
    <div style={{ position: "relative", minWidth: "200px" }}>
      <div
        onClick={onToggle}
        style={{
          width: "auto",
          height: "40px",
          borderRadius: "20px",
          fontWeight: "600",
          fontSize: "14px",
          color: "#8B5CF6",
          backgroundColor: "#F2F3FB",
          border: "none",
          padding: "14px",
          cursor: "pointer",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          
        }}
      >
        {value}
        <span style={{ color: "#8B5CF6", fontSize: "14px" }}>{isOpen ? "ᐱ" : "ᐯ"}</span>
      </div>

      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            left: "0",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "10px 0",
            listStyle: "none",
            zIndex: 100,
            maxHeight: "250px", // Hauteur max
            overflowY: "auto", // Scroll activé
          }}
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => selectOption(option)}
              style={{
                padding: "10px",
                cursor: "pointer",
                color: "#8B5CF6",
                textAlign: "center",
                transition: "background 0.2s",
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListChipFiltre;

import React, { useState } from "react";

const ToggleButtonGroup = ({ filters, onFilterChange }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
      {filters.map(({ key, label, options, value }) => (
        <CustomDropdown
          key={key}
          label={label}
          options={options}
          value={value}
          isOpen={openDropdown === key}
          onChange={(newValue) => onFilterChange(key, newValue)}
          onToggle={() => setOpenDropdown(openDropdown === key ? null : key)} // Gère l'ouverture/fermeture
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
    <div style={{ position: "relative", width: "200px" }}>
      <div
        onClick={onToggle}
        style={{
          width: "auto",
          height: "auto",
          borderRadius: "20px",
          fontWeight: "600",
          fontSize: "13px",
          textAlign: "start",
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
        {options.find((opt) => opt.value === value)?.label || label}
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
          }}
        >
          {options.map(({ label, value }) => (
            <li
              key={value}
              onClick={() => selectOption(value)}
              style={{
                padding: "10px",
                cursor: "pointer",
                color: "#8B5CF6",
                textAlign: "center",
                transition: "background 0.2s",
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToggleButtonGroup;

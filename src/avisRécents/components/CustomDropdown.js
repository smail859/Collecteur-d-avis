import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const CustomDropdown = ({ label, options, value, isOpen, onChange, onToggle, sx }) => {
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(isOpen);

  // Gérer l'affichage pour permettre l'animation de fermeture
  useEffect(() => {
    if (isOpen) {
      setShowDropdown(true);
    } else {
      // attendre la fin de l'animation avant de le cacher complètement
      const timeout = setTimeout(() => {
        setShowDropdown(false);
      }, 200); // durée de l'animation
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const selectOption = (selected) => {
    const selectedValue = typeof selected === "string" ? selected : selected.value;
    onChange(selectedValue);
    onToggle();
  };

  const getDisplayLabel = () => {
    if (typeof value === "object" && value !== null) return value.label;
    if (Array.isArray(options)) {
      const found = options.find((opt) => {
        if (typeof opt === "object") return opt.value === value;
        return opt === value;
      });
      return typeof found === "object" ? found?.label : found || label;
    }
    return label;
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", minWidth: "200px" }}>
      <div
        onClick={onToggle}
        style={{
          width: "auto",
          height: "40px",
          borderRadius: "20px",
          fontWeight: "600",
          fontSize: "14px",
          color: "#8B5CF6",
          border: "none",
          padding: "14px",
          cursor: "pointer",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          ...sx,
        }}
      >
        {getDisplayLabel()}
        <span style={{ color: "#8B5CF6", fontSize: "14px" }}>{isOpen ? "ᐱ" : "ᐯ"}</span>
      </div>

      {showDropdown && (
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
            maxHeight: "250px",
            overflowY: "auto",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0px)" : "translateY(-5px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {options.map((opt) => (
            <li
              key={typeof opt === "string" ? opt : opt.value}
              onClick={() => selectOption(opt)}
              style={{
                padding: "10px",
                cursor: "pointer",
                color: "#8B5CF6",
                textAlign: "center",
                transition: "background 0.2s",
              }}
            >
              {typeof opt === "string" ? opt : opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CustomDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ])
  ).isRequired,
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default CustomDropdown;
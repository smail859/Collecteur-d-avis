import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const CustomDropdown = ({ label, options, value, isOpen, onChange, onToggle, sx }) => {
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(isOpen);

  // Animation d'ouverture/fermeture
  useEffect(() => {
    if (isOpen) {
      setShowDropdown(true);
    } else {
      const timeout = setTimeout(() => {
        setShowDropdown(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Click en dehors
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
    <div ref={dropdownRef} style={{ position: "relative", minWidth: "190px" }}>
      <div
        onClick={onToggle}
        style={{
          width: "auto",
          height: "48px",
          backgroundColor: "#F2F3FB",
          borderRadius: "20px",
          fontWeight: 600,
          fontSize: "16px",
          color: "#8B5CF6",
          border: "none",
          padding: "0 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
          ...sx,
        }}
      >
        {getDisplayLabel()}
        <span style={{ fontSize: "12px", marginLeft: 8 }}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {showDropdown && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "0",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
            padding: "8px 0",
            listStyle: "none",
            zIndex: 10,
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
                padding: "10px 16px",
                cursor: "pointer",
                color: "#8B5CF6",
                textAlign: "left",
                fontSize: "14px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#F2F3FB")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
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
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    ])
  ).isRequired,
  value: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default CustomDropdown;

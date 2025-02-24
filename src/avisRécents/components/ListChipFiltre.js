import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";


/**
 * Filtrer les avis par services, notes, commerciaux, plateformes et période.
 */
const ListChipFiltre = ({ filters, onChangeFilters, dataFilters }) => {
  const handleChange = (event) => {
    onChangeFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      {/* Liste des filtres */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {dataFilters.map((filter) => (
          <FormControl key={filter.name} sx={{ minWidth: 160 }}>
            <InputLabel shrink sx={{ textAlign: "center", fontSize: "14px" }}>
              {filter.label}
            </InputLabel>
            <Select
              variant="standard"
              disableUnderline
              name={filter.name}
              value={filters[filter.name]}
              onChange={handleChange}
              sx={{
                background: "#F2F3FB",
                color: "#8B5CF6",
                width: "160px",
                height: "52px",
                padding: "14px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <MenuItem value="">
                <em>Tous</em>
              </MenuItem>
              {filter.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>
    </Box>
  );
};

ListChipFiltre.propTypes = {
  filters: PropTypes.object.isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  dataFilters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default ListChipFiltre;

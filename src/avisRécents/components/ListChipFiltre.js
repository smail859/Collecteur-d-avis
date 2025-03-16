import React from "react";
import PropTypes from "prop-types";
import { Select, Flex } from "antd";

/**
 * Filtrer les avis par services, notes, commerciaux, plateformes et période.
 */
const ListChipFiltre = ({ filters, onChangeFilters, dataFilters }) => {
  const handleChange = (key, value) => {
    onChangeFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Flex wrap="wrap" justify="center" gap="10px" style={{ width: "100%" }}>
      {dataFilters.map((filter) => (
        <Select
          key={filter.name}
          value={filters[filter.name] || filter.options[0]} 
          onChange={(value) => handleChange(filter.name, value)}
          style={{
            width: 180,
            height: 48,
            borderRadius: 12,
            fontWeight: "bold",
            fontSize: 14,
            color: "#6B5BFF",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          options={filter.options.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      ))}
    </Flex>
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

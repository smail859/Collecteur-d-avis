import { Select, Flex } from 'antd';

const ToggleButtonGroup = ({ filters, onFilterChange }) => {
  return (
    <Flex justify="space-between" style={{ marginBottom: '20px', gap: '10px' }}>
      {filters.map(({ key, label, options, value }) => (
        <Select
          key={key}
          value={value}
          onChange={(newValue) => onFilterChange(key, newValue)}
          style={{ width: 200 }}
        >
          {options.map(({ label, value }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      ))}
    </Flex>
  );
};

export default ToggleButtonGroup;

import { ToggleButton, ToggleButtonGroup,useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PeriodToggleButtons = ({ selected, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const periods = [
    { label: "Aujourd'hui", value: "today" },
    { label: "7 derniers jours", value: "7days" },
    { label: "30 derniers jours", value: "30days" },
  ];
  
  if (isMobile) return null;

  return (
    <ToggleButtonGroup
      exclusive
      value={selected}
      onChange={(e, newValue) => newValue && onChange(newValue)}
      sx={{
        backgroundColor: "#F2F3FB",
        borderRadius: "20px",
        padding: "4px",
        display: "flex",
        height: "48px",
        alignItems: "center",
        gap: '10px',
        
      }}
    >
      {periods.map(({ label, value }) => (
        <ToggleButton
          key={value}
          value={value}
          disableRipple
          sx={{
            border: "none",
            borderRadius: "20px !important",
            textTransform: "none",
            px: 3,
            py: 1,
            
            fontWeight: 600,
            fontSize: "16px",
            height: "40px",
            color: theme.palette.custom.violetRealty,
            background:
              selected === value
                ? "linear-gradient(90deg, #2972FF 0%, #8B5CF6 100%)"
                : "white",
            "&:hover": {
              background: selected === value ? undefined : "#E7E6FB",
            },
            "&.Mui-selected": {
              color: "#fff",
            },
          }}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default PeriodToggleButtons;

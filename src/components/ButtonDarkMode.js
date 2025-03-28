import { Button } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

const ButtonDarkMode = ({ darkMode, onToggle }) => {
  return (
    <Button disabled onClick={onToggle} variant="contained" startIcon={darkMode ? <LightMode /> : <DarkMode />}/>
  );
};

export default ButtonDarkMode;

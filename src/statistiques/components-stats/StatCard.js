
import { Box, Typography, LinearProgress, styled, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const CustomLinearProgress = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: "#E0E0E0",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundColor: "#00C853",
  },
}));

const StatCard = ({ label, value, progress }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "300px",
        height: isMobile ? "180px" : "240px",
        borderRadius: 3,
        bgcolor: "#F6F7FE",
        padding: isMobile ? 2 : 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        mx: "auto",
        boxShadow: "0px 4px 10px rgba(139, 92, 246, 0.1)",
      }}
    >
      <Box sx={{ mt: 1, mb: 2 }}>
        <CustomLinearProgress
          variant="determinate"
          value={progress}
          sx={{ width: "120px", height: "18px" }}
        />
      </Box>

      <Box mt="auto">
        <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
          <span style={{ fontWeight: 700, color: "black" }}>Gains </span>
          <span style={{ color: "black" }}>{label} (€)</span>
        </Typography>

        <Typography
          sx={{
            fontWeight: "bold",
            color: "#8B5CF6",
            fontSize: isMobile ? "54px" : "100px",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  progress: PropTypes.number.isRequired,
};

export default StatCard;

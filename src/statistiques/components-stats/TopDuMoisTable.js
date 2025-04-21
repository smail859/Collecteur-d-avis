import { Box, useTheme, useMediaQuery, Fade, Grow } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const TopDuMoisTable = ({
  top3,
  selectedCommercial,
  selectedCommercialData,
  selectedRank,
  isSelectedInTop3,
  isSelectedCommercialValid,
  reviews,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) return null;

  const getRankStyle = (rank, isActive) => ({
    background: isActive
      ? "red"
      : rank === 1
      ? "linear-gradient(to right, #8B5CF6, #2972FF)"
      : rank === 2
      ? "transparent"
      : rank === 3
      ? "#FFF"
      : "transparent",
    color: isActive ? "white" : "black",
    borderBottom: "none",
  });

  const normalizeText = (text) => {
    if (!text || typeof text !== "string") return "";
    return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  };

  const getAverageRatingForCommercial = (name) => {
    if (!Array.isArray(reviews)) return "0.0";

    const normalizedName = normalizeText(name);
    const regex = new RegExp(`\\b${normalizedName}\\b`, "i");

    const filtered = reviews.filter((review) => {
      const text = normalizeText(review.text || review.snippet || "");
      return regex.test(text);
    });

    if (filtered.length === 0) return "0.0";
    const sum = filtered.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (sum / filtered.length).toFixed(1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "auto",
        bgcolor: "#F2F3FB",
        marginTop: "20px",
        borderRadius: "20px",
        padding: "20px",
        fontSize: "20px",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            padding: "12px",
            borderRadius: "10px",
            color: "#8B5CF6",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "20%" }}>Top du mois</Box>
          <Box sx={{ width: "15%", textAlign: "center" }}>Avis</Box>
          <Box sx={{ width: "20%", textAlign: "center" }}>Gains bruts</Box>
          <Box sx={{ width: "20%", textAlign: "center" }}>Gains nets</Box>
          <Box sx={{ width: "20%", textAlign: "center" }}>Note moyenne</Box>
        </Box>

        {top3.map((commercial, index) => {
          const isActive = commercial.name === selectedCommercial;
          let gainBrut = commercial.avis * 10;
          let gainNet = ((gainBrut * 7.96) / 10).toFixed(2);

          if (commercial.name === "Lucas" || commercial.name === "Smaïl")
            gainNet = Math.min(gainNet, 200);
          else gainNet = Math.min(gainNet, 100);

          return (
            <Grow in={true} timeout={400 + index * 150} key={commercial.name}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "20px",
                  ...getRankStyle(commercial.top, isActive),
                }}
              >
                <Box
                  sx={{
                    width: "20%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: "bold",
                    color: commercial.top === 1 ? "white" : "black",
                  }}
                >
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "15px",
                      backgroundColor: isActive
                        ? "red"
                        : commercial.top === 1
                        ? "#FF8C00"
                        : commercial.top === 2
                        ? "#FF007F"
                        : "#FF0063",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {index + 1}
                  </Box>
                  {commercial.name}
                </Box>

                <Box sx={{ width: "17%", textAlign: "center", color: commercial.top === 1 ? "white" : "black" }}>
                  {commercial.avis}
                </Box>

                <Box sx={{ width: "20%", textAlign: "center", color: commercial.top === 1 ? "white" : "black" }}>
                  {commercial.avis * 10}€
                </Box>

                <Box sx={{ width: "20%", textAlign: "center", color: commercial.top === 1 ? "white" : "black",marginLeft: 3, }}>
                  {gainNet}€
                </Box>

                <Box sx={{ width: "131.5px", height: "62.5px", marginLeft: 7  }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "16px",
                      backgroundColor: "white",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      boxShadow:
                        commercial.top === 3
                          ? "rgba(149, 157, 165, 0.2) 0px 8px 24px"
                          : "none",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <strong>
                      {getAverageRatingForCommercial(commercial.name)}
                    </strong>
                    <StarIcon sx={{ color: "gold", fontSize: "18px" }} />
                  </Box>
                  </Box>
              </Box>
            </Grow>
          );
        })}

        {!isSelectedInTop3 && isSelectedCommercialValid && selectedRank > 3 && (
          <Fade in timeout={500}>
            <Box
              key={selectedCommercial}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                borderRadius: "20px",
                backgroundColor: "red",
              }}
            >
              <Box sx={{ width: "20%", display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", color: "white" }}>
                <Box
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "15px",
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {selectedRank}
                </Box>
                {selectedCommercialData.name}
              </Box>

              <Box sx={{ width: "15%", textAlign: "center", color: "white" }}>
                {selectedCommercialData.count}
              </Box>

              <Box sx={{ width: "20%", textAlign: "center", color: "white" }}>
                {selectedCommercialData.count * 10}€
              </Box>

              <Box sx={{ width: "20%", textAlign: "center", color: "white" }}>
                {selectedCommercialData.count * 10}€
              </Box>

              <Box sx={{ width: "20%", display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    fontSize: "20px",
                    backgroundColor: "white",
                    padding: "8px 12px",
                    borderRadius: "10px",
                  }}
                >
                  <strong>
                    {getAverageRatingForCommercial(selectedCommercialData.name)} <StarIcon sx={{ color: "gold" }} />
                  </strong>
                </Box>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default TopDuMoisTable;

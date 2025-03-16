import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
} from "@mui/material";

/**
 * Exemple d'hypothèses :
 * - On suppose que commercialCounts est un tableau d'objets du type :
 *   [{ name: "Joanna M", count: 8 }, { name: "Mélanie", count: 7 }, ...]
 * - Gains bruts = count * 10€
 * - Gains nets = gainsBruts * 0.796 (exemple de coefficient)
 * - Note moyenne : ici on génère une valeur aléatoire pour l'exemple,
 *   mais vous pouvez la récupérer depuis vos données si elle existe.
 * - On classe les commerciaux par ordre décroissant de count pour un "Top du mois".
 */
const CommercialTable = ({ commercialCounts }) => {
  // Tri par nombre d'avis (ordre décroissant) pour un classement
  const sortedCommercials = [...commercialCounts].sort((a, b) => b.count - a.count);

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "#ffffff",
        m: 2,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        minWidth: 600,
      }}
    >
      {/* Titre principal */}
      <Typography
        variant="h4"
        textAlign="left"
        mb={3}
        sx={{ fontWeight: "bold", color: "#121826" }}
      >
        Top du mois
      </Typography>

      <Table>
        {/* En-tête */}
        <TableHead>
          <TableRow
            sx={{
              background: "linear-gradient(90deg, #7B61FF 0%, #8B5CF6 100%)",
              "& th": {
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                border: "none",
              },
            }}
          >
            <TableCell sx={{ width: 70 }}>#</TableCell>
            <TableCell>Commercial</TableCell>
            <TableCell align="center">Avis</TableCell>
            <TableCell align="center">Gains bruts</TableCell>
            <TableCell align="center">Gains nets</TableCell>
            <TableCell align="center">Note moyenne</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedCommercials.map((commercial, index) => {
            // Calcul hypothétique des gains
            const gainsBruts = commercial.count * 10;
            const gainsNets = parseFloat((gainsBruts * 0.796).toFixed(2));
            // Note moyenne aléatoire pour l'exemple
            const noteMoyenne = (3.5 + Math.random() * 1.5).toFixed(1);

            // Classement (#1, #2, #3, etc.)
            const rank = index + 1;

            // Styles spéciaux pour les 3 premiers
            let rankBg;
            if (rank === 1) {
              // Or
              rankBg = "linear-gradient(90deg, #FBB034 0%, #FFDD00 100%)";
            } else if (rank === 2) {
              // Argent
              rankBg = "linear-gradient(90deg, #BDC3C7 0%, #2C3E50 100%)";
            } else if (rank === 3) {
              // Bronze
              rankBg = "linear-gradient(90deg, #D7AF70 0%, #F0C27B 100%)";
            } else {
              // Autres
              rankBg = "#7B61FF";
            }

            return (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(even)": { backgroundColor: "#F9F9FF" },
                  "&:hover": { backgroundColor: "#EFEFFE" },
                }}
              >
                {/* Colonne du rang avec un style "badge" */}
                <TableCell sx={{ border: "none" }}>
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      background: rankBg,
                    }}
                  >
                    {rank}
                  </Box>
                </TableCell>

                {/* Nom du commercial */}
                <TableCell
                  sx={{
                    border: "none",
                    fontWeight: "medium",
                    color: "#121826",
                  }}
                >
                  {commercial.name}
                </TableCell>

                {/* Nombre d'avis */}
                <TableCell
                  align="center"
                  sx={{
                    border: "none",
                    fontWeight: "medium",
                    color: "#121826",
                  }}
                >
                  {commercial.count} avis
                </TableCell>

                {/* Gains bruts */}
                <TableCell
                  align="center"
                  sx={{
                    border: "none",
                    fontWeight: "medium",
                    color: "#121826",
                  }}
                >
                  {gainsBruts}€
                </TableCell>

                {/* Gains nets */}
                <TableCell
                  align="center"
                  sx={{
                    border: "none",
                    fontWeight: "medium",
                    color: "#121826",
                  }}
                >
                  {gainsNets}€
                </TableCell>

                {/* Note moyenne (avec une petite étoile) */}
                <TableCell
                  align="center"
                  sx={{
                    border: "none",
                    fontWeight: "medium",
                    color: "#121826",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {noteMoyenne}
                    <Typography
                      component="span"
                      sx={{ color: "#FFCE31", fontSize: "18px" }}
                    >
                      ★
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Légende */}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          textAlign: "center",
          color: "#555",
        }}
      >
        (Les données représentent le total des avis mensuels par commercial.)
      </Typography>
    </Paper>
  );
};

export default CommercialTable;

import { useState } from "react";
import "dayjs/locale/fr";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, Modal, Grid, Stack, Typography,useMediaQuery, useTheme } from "@mui/material";
import ListChipFiltre from "../avisRécents/components/ListChipFiltre";

const CalendarDate = ({ onPeriodChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Toutes les périodes");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  // Filtres disponibles pour la période
  const dataFilters = [
    { 
      name: "periode", 
      label: "Sélectionner une période", 
      options: ["Toutes les périodes", "Cette semaine", "Ce mois", "Cette année"] 
    }
  ];

  // Gère la sélection rapide d'une période
  const handleFilterChange = (newFilters) => {
    const period = newFilters.periode;
    setSelectedPeriod(period);

    if (period === "Toutes les périodes") {
      onPeriodChange(null); // Aucune période sélectionnée
    } else if (["Cette semaine", "Ce mois", "Cette année"].includes(period)) {
      let now = dayjs().startOf("day"); // Fixer l'heure à minuit
      let start = null;

      if (period === "Cette semaine") {
        start = now.subtract(7, "day");
      } else if (period === "Ce mois") {
        start = now.startOf("month");
      } else if (period === "Cette année") {
        start = now.startOf("year");
      }

      if (start) {
        onPeriodChange({ start: start.format("YYYY-MM-DD"), end: now.format("YYYY-MM-DD") });
        setOpen(false); // Ferme la modal immédiatement après sélection
      }
    }
  };

  // Gère la sélection personnalisée d'une plage de dates
  const handleCustomDateChange = (date, type) => {
    if (type === "start") setStartDate(date);
    if (type === "end") setEndDate(date);
  };

  // Applique la sélection d'une plage de dates
  const applyCustomDateRange = () => {
    if (startDate && endDate) {
      const customPeriod = { start: startDate.format("YYYY-MM-DD"), end: endDate.format("YYYY-MM-DD") };
      setSelectedPeriod("Période personnalisée");
      onPeriodChange(customPeriod);
      setOpen(false); // Ferme la modal après validation
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          textTransform: "none",
          backgroundColor: "#F6F5FF", 
          color: "#8B5CF6", 
          fontWeight: "bold",
          borderRadius: "20px", 
          width: isMobile ? "50%" : "20%",
          padding: "10px 20px",
          boxShadow: "none", 
        }}
      >
        Sélectionner une période
      </Button>


      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? 400 : 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
          }}
        >
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            Sélectionnez une période
          </Typography>

          {/* Sélection rapide via ListChipFiltre */}

          <ListChipFiltre 
            dataFilters={dataFilters} 
            filters={{ periode: selectedPeriod }} 
            onChangeFilters={handleFilterChange} 
          />


          <Typography variant="subtitle1" fontWeight="bold" textAlign="center" mt={5} mb={1}>
            Ou sélectionnez une plage de dates :
          </Typography>

          {/* Sélection personnalisée d'une plage de dates */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={(newValue) => handleCustomDateChange(newValue, "start")}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={(newValue) => handleCustomDateChange(newValue, "end")}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>

          {/* Boutons */}
          <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{
                textTransform: "none",
                borderColor: "#6B5BFF",
                color: "#6B5BFF",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#F3F0FF" },
              }}
            >
              Annuler
            </Button>

            {/* ✅ Bouton activé seulement si l'utilisateur choisit une période personnalisée */}
            {startDate && endDate && (
              <Button
                variant="contained"
                onClick={() => {
                  applyCustomDateRange(); // Appliquer la sélection
                  setStartDate(null); // Réinitialiser la date de début
                  setEndDate(null); // Réinitialiser la date de fin
                }}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#6B5BFF",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#5A4DE7" },
                }}
              >
                ✅ Valider la sélection
              </Button>
            )}
          </Stack>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default CalendarDate;

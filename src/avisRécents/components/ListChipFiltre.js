import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const AvisFilter = () => {

  /**
   * Filtrer les avis par services
   * Filtrer les avis par notes
   * Filtrer les avis par commerciaux
   * Filtrer les avis par plateformes
   * Filtrer les avis par période
  */

  const [filters, setFilters] = useState({
    commercial: "",
    note: "",
    periode: "",
    plateforme: "",
  });

  // Fonction unique pour mettre à jour n'importe quel filtre
  const handleChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column", 
            gap: 2,
            flexWrap: "wrap",
            width: "100%",
            height: "auto",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        {/** Liste des filtres */}
        <Box
            sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            textAlign: 'center'
            }}
        >
            {[
            { name: "services", label: "Tous les services", options: ["MonBien", "Startloc", "PigeOnline"] },
            { name: "note", label: "Notes", options: ["5 étoiles", "4 étoiles", "3 étoiles", "2 étoiles", "1 étoile"] },
            { name: "commercial", label: "Tous l'équipe Realty", options: ["Joanna", "Mélanie", "Smaïl"] },
            { name: "plateforme", label: "Toutes les plateformes", options: ["Google", "TrustPilot"] },
            { name: "periode", label: "Séléctionner une période", options: ["Cette semaine", "Ce mois", "Cette année"] },
            ].map((filter) => (
            <FormControl key={filter.name} sx={{ minWidth: 160 }}>
                <InputLabel shrink sx={{ textAlign: "center", fontSize: "14px" }}>{filter.label}</InputLabel>
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
                    border: "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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

        {/** Typographie placée en bas + Icône */}
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: "center", gap: 1, marginBottom:'20px'}}>
            <Typography
                sx={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: '150%',
                }}
                variant="subtitle1"
            >
                <Typography component="span" sx={{ color: "#8B5CF6" }}>
                  84 avis
                </Typography> 4 étoiles trouvés pour Joanna
            </Typography>
            <SearchOutlinedIcon sx={{width: "19.5px", height: "19.5px", color: '#2972FF'}}/>
        </Box>
    </Box>
  );
};

export default AvisFilter;











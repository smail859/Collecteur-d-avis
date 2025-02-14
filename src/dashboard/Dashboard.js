import {Box, Stack } from '@mui/material';
import MainGrid from './components/MainGrid';
import { useEffect, useState } from "react";




export default function Dashboard(props) {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/get-reviews") // URL de l'API FastAPI
      .then(response => response.json())
      .then(data => setReviews(data.reviews))
      .catch(error => console.error("Erreur :", error));
  }, []);

  return (
      <Box >
        {/* ✅ Contenu principal  */}
        <Box sx={{ flexGrow: 1, bgcolor: '#F5F7FF', }}>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Stack>
              <MainGrid />
              <div>
                <h2>Google Avis</h2>
                <ul>
                  {reviews.map((review, index) => (
                    <li key={index}>{review}</li>
                  ))}
                </ul>
              </div>
            </Stack>
          </Box>
        </Box>
      </Box>
  );
}

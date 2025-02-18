import {Box, Stack } from '@mui/material';
import MainGrid from './components/MainGrid';

export default function Dashboard() {


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
            </Stack>
          </Box>
        </Box>
      </Box>
  );
}

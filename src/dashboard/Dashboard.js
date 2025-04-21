import { Box, Stack } from '@mui/material';
import MainGrid from './components/MainGrid';

export default function Dashboard() {


  return (
    <Box>
      {/* Contenu principal  */}
      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <Stack>
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

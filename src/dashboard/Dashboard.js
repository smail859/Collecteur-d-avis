import { CssBaseline, Box, Stack } from '@mui/material';
import MainGrid from './components/MainGrid';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

// Fusion des personnalisations du thème
const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      
      <Box sx={{ display: 'flex' }}>

        {/* ✅ Contenu principal (sans AppNavbar ni Footer) */}
        <Box sx={{ flexGrow: 1, bgcolor: '#F5F7FF', overflow: 'auto' }}>
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              overflow: 'auto',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            })}
          >
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <MainGrid />
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}

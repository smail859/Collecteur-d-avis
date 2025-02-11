<<<<<<< HEAD
import * as React from 'react';

import { alpha } from '@mui/material/styles';
=======

>>>>>>> 60ff468 (Reconnecté au repo GitHub)
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
<<<<<<< HEAD
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
=======
import Footer from './components/Footer';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

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
<<<<<<< HEAD
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <MainGrid />
          </Stack>
        </Box>
=======
      <Box>
        <AppNavbar />
        <Box
          component="main"
          sx={({
            bgcolor: '#F5F7FF'
          })}
        >
          <Stack>
            <Header />
            <MainGrid/>
          </Stack>
        </Box>
        <Footer/>
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
      </Box>
    </AppTheme>
  );
}

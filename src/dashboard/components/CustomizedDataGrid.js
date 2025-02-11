<<<<<<< HEAD
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { columns, rows } from '../internals/data/gridData';

export default function CustomizedDataGrid() {
  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
          },
        },
      }}
    />
=======
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { Star, ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

// Données des services avec icônes
const servicesData = [
  { id: 1, name: 'Monbien', icon: '/icons/monbien.png', trustpilot: '568 - 4.8/5', google: '568 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '1 004 avis', avgRating: 4.8, trend: 'down' },
  { id: 2, name: 'Startloc', icon: '/icons/startloc.png', trustpilot: '260 - 4.8/5', google: '260 - 4.8/5', appStore: '18 - 4.8/5', googlePlay: '36 - 4.8/5', totalReviews: '398 avis', avgRating: 4.3, trend: 'up' },
  { id: 3, name: 'Marketing Automobile', icon: '/icons/marketing-auto.png', trustpilot: '568 - 4.8/5', google: '568 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '1 004 avis', avgRating: 4.1, trend: 'neutral' },
  { id: 4, name: 'Marketing Immobilier', icon: '/icons/marketing-immo.png', trustpilot: '260 - 4.8/5', google: '84 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '344 avis', avgRating: 3.8, trend: 'down' },
  { id: 5, name: 'Sinimo', icon: '/icons/sinimo.png', trustpilot: '260 - 4.8/5', google: '260 - 4.8/5', appStore: '360 - 4.8/5', googlePlay: '360 - 4.8/5', totalReviews: '140 avis', avgRating: 3.3, trend: 'up' },
  { id: 6, name: 'Pige Online', icon: '/icons/pige-online.png', trustpilot: '360 - 4.8/5', google: '360 - 4.8/5', appStore: '-', googlePlay: '-', totalReviews: '140 avis', avgRating: 2.2, trend: 'neutral' },
];

// Couleurs des tendances
const getTrendIcon = (trend) => {
  if (trend === 'up') return <ArrowUpward style={{ color: 'green' }} />;
  if (trend === 'down') return <ArrowDownward style={{ color: 'red' }} />;
  return <Remove style={{ color: 'gray' }} />;
};

export default function ServicesTable() {
  return (
    <Box sx={{ padding: '40px', borderRadius: '12px' }}>
      {/* Titre */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ color: '#333' }}>
        Nombre d’avis et notes <span style={{ color: '#6B5BFF' }}>par services</span>
      </Typography>

      {/* Sous-titre */}
      <Typography variant="body1" textAlign="center" sx={{ color: '#555', marginBottom: '20px' }}>
        Analysez les performances de vos services grâce aux notes et avis clients collectés sur chaque plateforme.
      </Typography>

      {/* Tableau avec fond blanc */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          overflow: 'hidden', 
          padding: '10px',
        }}
      >
        <Table>
          {/* En-tête */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#6B5BFF' }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#6B5BFF' }}>Trustpilot avis/notes</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#6B5BFF' }}>Google avis/notes</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#6B5BFF' }}>App Store avis/notes</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#6B5BFF' }}>Google Play avis/notes</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#6B5BFF' }}>Total d’avis</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#6B5BFF' }}>Note moyenne </TableCell>
            </TableRow>
          </TableHead>

          {/* Corps du tableau avec effet zébré et bordure violette */}
          <TableBody>
            {servicesData.map((service, index) => (
              <TableRow 
                key={service.id} 
                sx={{ 
                  backgroundColor: index % 2 === 0 ? 'white' : '#F2F3FB', // Alterner le fond
                  borderBottom: '1px solid #6B5BFF', // Bordure violette entre chaque ligne  
                }}
              >
                {/* Service avec icône */}
                <TableCell sx={{ borderBottom: 'none' }}> {/* Suppression de la border-bottom par défaut */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <img src={service.icon} alt={service.name} width={32} height={32} />
                    <Typography>{service.name}</Typography>
                  </Box>
                </TableCell>

                {/* Avis et notes */}
                <TableCell sx={{ borderBottom: 'none' }}>{service.trustpilot}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{service.google}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{service.appStore}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{service.googlePlay}</TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>{service.totalReviews}</TableCell>

                {/* Note moyenne avec icône */}
                <TableCell sx={{ borderBottom: 'none', padding: "30px" }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getTrendIcon(service.trend)}
                    <Typography>{service.avgRating}</Typography>
                    <Star style={{ color: '#FFC107' }} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
  );
}

import * as React from 'react';
<<<<<<< HEAD
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function StatCard({ title, value, interval, trend, data }) {
  const theme = useTheme();
  const daysInWeek = getDaysInMonth(4, 2024);

  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: 'success',
    down: 'error',
    neutral: 'default',
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];
  const trendValues = { up: '+25%', down: '-25%', neutral: '+5%' };

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              <Chip size="small" color={color} label={trendValues[trend]} />
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: daysInWeek, // Use the correct property 'data' for xAxis
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </Stack>
=======
import { Card, CardContent, Typography, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function StatCard() {
  return (
    <Card
      variant="elevation"
      sx={{
        width: "100%",
        textAlign: 'center',
        backgroundColor: '#F0F4FF',
        borderRadius: '16px',
        p: 2,
        boxShadow: 'none'
      }}
    >
      <CardContent>
        {/* Icône étoiles */}
        <Stack direction="row" justifyContent="center" spacing={0.5} sx={{ mb: 1 }}>
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} sx={{ color: '#FFA726', fontSize: '20px' }} />
          ))}
        </Stack>

        {/* Nombre d'avis collectés */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: '36px',
            background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          5 209
        </Typography>

        {/* Texte "Avis collectés" */}
        <Typography variant="subtitle1" sx={{ color: '#6366F1', fontWeight: '500' }}>
          Avis collectés
        </Typography>
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
      </CardContent>
    </Card>
  );
}

<<<<<<< HEAD
StatCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  interval: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['down', 'neutral', 'up']).isRequired,
  value: PropTypes.string.isRequired,
};

=======
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
export default StatCard;

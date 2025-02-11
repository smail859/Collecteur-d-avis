import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
<<<<<<< HEAD

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

=======
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ✅ Composant personnalisé pour afficher un bouton au lieu d'un champ texte
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
<<<<<<< HEAD
      size="small"
      onClick={() => setOpen?.((prev) => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
    >
      {label ? `${label}` : 'Pick a date'}
=======
      onClick={() => setOpen?.((prev) => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{
        backgroundColor: 'white',
        color: '#6B5BFF',
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: 'bold',
        textTransform: 'none',
      }}
    >
      {label ? `${label}` : 'Sélectionner une date'}
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
    </Button>
  );
}

ButtonField.propTypes = {
<<<<<<< HEAD
  /**
   * If `true`, the component is disabled.
   * @default false
   */
=======
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.shape({
    'aria-label': PropTypes.string,
  }),
  InputProps: PropTypes.shape({
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
  }),
  label: PropTypes.node,
  setOpen: PropTypes.func,
};

<<<<<<< HEAD
export default function CustomDatePicker() {
  const [value, setValue] = React.useState(dayjs('2023-04-17'));
  const [open, setOpen] = React.useState(false);

=======
// ✅ Composant principal : Sélecteur de date avec bouton
export default function CustomDatePicker({ onDateChange }) {
  const [value, setValue] = React.useState(dayjs()); // Valeur par défaut : aujourd’hui
  const [open, setOpen] = React.useState(false);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (onDateChange) {
      onDateChange(newValue.format('DD/MM/YYYY')); // Transmettre la date en format lisible
    }
  };

>>>>>>> 60ff468 (Reconnecté au repo GitHub)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
<<<<<<< HEAD
        label={value == null ? null : value.format('MMM DD, YYYY')}
        onChange={(newValue) => setValue(newValue)}
=======
        label={value ? value.format('DD/MM/YYYY') : 'Sélectionner une date'}
        onChange={handleDateChange}
        minDate={dayjs().subtract(1, 'year')} // Empêche de choisir une date de plus d'un an en arrière
        maxDate={dayjs().add(1, 'year')} // Empêche de choisir une date de plus d'un an dans le futur
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        views={['day', 'month', 'year']}
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setOpen },
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
<<<<<<< HEAD
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        views={['day', 'month', 'year']}
=======
>>>>>>> 60ff468 (Reconnecté au repo GitHub)
      />
    </LocalizationProvider>
  );
}
<<<<<<< HEAD
=======

CustomDatePicker.propTypes = {
  onDateChange: PropTypes.func, // Permet de récupérer la date sélectionnée
};
>>>>>>> 60ff468 (Reconnecté au repo GitHub)

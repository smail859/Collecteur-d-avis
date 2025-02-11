import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, IconButton, InputAdornment, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import icon from '../image/icon.png';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <>
        <Box sx={{ position: 'absolute', top: 20, left: 30}}>
            <img src={icon} alt="Logo Groupe Realty" style={{ height: '50px' }} />
        </Box>

        <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #E0ECFF, #F5F7FA)' }}>
        <Card sx={{ width: 400, p: 4, boxShadow: 5, borderRadius: 4, backgroundColor: '#fff' }}>
            <CardContent>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                Connexion
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ fontWeight: '900', color: '#8B5CF6' }}>Email</Typography>
                <TextField
                    placeholder="smail.elhajjar@groupe-realty.com"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{ borderRadius: '12px', backgroundColor: '#F5F7FA' }}
                    InputProps={{ sx: { borderRadius: '12px' } }}
                    required
                />

                <Typography sx={{ fontWeight: '900', color: '#8B5CF6' }}>Mot de passe</Typography>
                <TextField
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    sx={{ borderRadius: '12px', backgroundColor: '#F5F7FA' }}
                    InputProps={{
                        sx: { borderRadius: '12px' },
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        )
                    }}
                    required
                />  
                {/* Si besoin  */}
                {/* <Link href="#" underline="hover" sx={{ color: '#6A1B9A', textAlign: 'right', mt: 1 }}>
                Mot de passe oublié ?
                </Link> */}

                <Button
                type="submit"
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                sx={{
                    mt: 2,
                    py: 1.5,
                    background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0px 4px 10px rgba(41, 114, 255, 0.4)',
                    '&:hover': {
                    background: 'linear-gradient(90deg, #2466E0, #7A4FCF)',
                    },
                }}
                >
                Valider
                </Button>
            </Box>
            </CardContent>
        </Card>
        </Box>
    </>
  );
}

export default LoginForm;

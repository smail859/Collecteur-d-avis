import { Card, CardContent, CardHeader, CardActions, Typography, Avatar, Button, Box, Stack, Link } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

const AvisCard = ({ name, date, review, rating }) => {
  return (
    <Card sx={{ 
      width: "350px", 
      minHeight: "200px",
      backgroundColor: '#F2F3FB', 
      borderRadius: '15px', 
      boxShadow: 2, 
      padding: 2,
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'space-between' 
    }}>
      {/* En-tête de la carte */}
      <CardHeader
        avatar={<Avatar>{name.charAt(0)}</Avatar>}
        title={name}
        subheader={date}
        sx={{ paddingBottom: 0 }}
      />

      {/* Contenu de l'avis */}
      <CardContent sx={{ paddingTop: 1, flexGrow: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {[...Array(rating)].map((_, i) => (
            <StarIcon key={i} sx={{ color: '#FFD700' }} />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {review}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <FolderOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />
            <Link underline="none" sx={{ color: '#8B5CF6', fontSize: '14px', }}>Voir dans le CRM</Link>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <ContentPasteGoOutlinedIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />
            <Link underline="none" sx={{ color: '#8B5CF6', fontSize: '14px'}}>Exporter</Link>
          </Stack>
        </Stack>

        <Button 
          sx={{
            background: 'linear-gradient(90deg, #2972FF, #8B5CF6)',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#FFFFFF',
            boxShadow: '0px 4px 10px rgba(41, 114, 255, 0.4)',
            textAlign: 'center',
            '&:hover': { opacity: 0.9 }
          }} 
          endIcon={<SendOutlinedIcon />} 
          size="small"
        >
          Répondre
        </Button>
      </CardActions>
    </Card>
  );
};

const ListeAvis = () => {
  const avis = [
    { name: "Béatrice Silhau", date: "Il y a 1 semaine", review: "Super service, très professionnel !", rating: 5 },
    { name: "Laetitia L.", date: "Il y a 2 semaines", review: "Je recommande vivement cette application.", rating: 4 },
    { name: "Quentin Royer", date: "Il y a 1 mois", review: "Facile d'utilisation et efficace.", rating: 5 },
    { name: "Béatrice Silhau", date: "Il y a 1 semaine", review: "Service rapide et efficace.", rating: 4 },
    { name: "Laetitia L.", date: "Il y a 2 semaines", review: "Interface intuitive et fluide !", rating: 5 },
    { name: "Quentin Royer", date: "Il y a 1 mois", review: "Je l'utilise tous les jours pour mon travail.", rating: 5 },
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        justifyContent: 'center', 
        maxWidth: "1200px", 
        mx: "auto",
        overflowY: "auto",
        paddingBottom: 4
      }}
    >
      {avis.map((a, index) => (
        <AvisCard key={index} {...a} />
      ))}
    </Box>
  );
};

export default ListeAvis;

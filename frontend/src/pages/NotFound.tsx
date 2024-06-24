import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material'
import imgErr from '../assets/404.png'

function NotFound() {
  return (
    <Box
      sx={{
        my: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100%'
      }}
    >
      <img
        style={{ width: '100%', objectFit: 'contain', height: '28rem' }}
        src={imgErr}
        alt='notfound'
      />
      <Typography variant="h5" gutterBottom sx={{ my: 2 }}>
        Trang bạn đang tìm có thể không khả dụng hoặc không tồn tại.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="outlined"
        sx={{
          backgroundColor: '#466874',
          my: 2,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#fff',
            color: '#466874',
            border: '1px solid #466874'
          }
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
}

export default NotFound;

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, Box, CardActionArea } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import moment from 'moment';
import 'moment/locale/vi';
import { useNavigate } from 'react-router-dom';

export default function OrderCard({order}: any) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/order/${order.orderid}`);
  };

  moment.locale();
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Avatar alt="Avatar" src={order.avatar} />
            <Box sx={{ ml: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography fontWeight="bold" variant="body1" color="initial">{order.username ? order.username : `${order.firstname} ${order.lastname}`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <AccessTimeOutlinedIcon fontSize="small" />
                <Typography ml={1} variant="body2" color="initial" fontStyle='italic'>{moment(order.createdat).fromNow()}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Typography gutterBottom variant="body1" fontWeight='bold'>Trạng thái </Typography>
            <Typography ml={1} gutterBottom variant="body1" fontWeight='bold' color="customColor.status"> {order.status} </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {order.description}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="140"
          image={order.path}
          alt="img"
        />
      </CardActionArea>
    </Card>
  );
}

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, Box, CardActionArea, Stack } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import moment from 'moment';
import 'moment/locale/vi';
import { useNavigate } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

export default function OrderCard({order, isPost, canApproval, canDelete}: any) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if(isPost){
      navigate(`/post/${order.postid}`);
    }else{
      navigate(`/order/${order.orderid}`);
    }
    
  };

  moment.locale();
  return (
    <Card sx={{ maxWidth: 345 }} style={{boxShadow: '1px 2px 3px #6D6D6D'}}>
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
          height="180"
          image={order.path}
          alt="img"
        />
      </CardActionArea>
      <Stack
        direction="row"
        justifyContent='flex-end'
        alignItems='center'>
        {
          canApproval && 
          <Stack
            direction="row"
            justifyContent='flex-end'
            alignItems='center'
            sx={{p: 2}}>
              <CheckCircleOutlineOutlinedIcon color='success'/>
              <Typography variant='inherit' color='success'>Duyệt</Typography>
          </Stack>
        }

        {
          canDelete && 
          <Stack
            direction="row"
            justifyContent='flex-end'
            alignItems='center'
            sx={{p: 2}}>
              <RemoveCircleIcon color='error'/>
              <Typography variant='inherit' color='error'>Xóa</Typography>
          </Stack>
        }
      </Stack>
      
    </Card>
  );
}

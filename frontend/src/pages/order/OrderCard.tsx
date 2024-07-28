import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea,  } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import moment from 'moment';
import 'moment/locale/vi';
import { useNavigate } from 'react-router-dom';
import AvatarComponent from '../../components/AvatarComponent';
import { useState } from 'react';
// import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
// import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

export default function OrderCard({order, locationOfItem, isPost, canApproval, canDelete, isWaitForPost}: any) {
  const navigate = useNavigate();
  const [isShowReceiver] = useState(locationOfItem === 1 && (order.givetypeid === 1 || order.givetypeid === 3 || order.givetypeid === 4))

  const handleCardClick = () => {
    if(isPost){
      navigate(`/post/${order.postid}`, { state: {canApproval, canDelete, isWaitForPost}});
    }else{
      navigate(`/order/${order.orderid}`);
    }
    
  };

  const handleNavigateToUserProfile = (userID: string, event: any) => {
    event.stopPropagation();
    navigate(`/about-profile?profileID=${userID}`)
  }

  moment.locale();
  return (
    <Card sx={{ maxWidth: 345 }} style={{boxShadow: '1px 2px 3px #6D6D6D'}}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent>

          {
            order.give_receivetype && 
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Typography gutterBottom variant="body1" fontWeight='bold' color="#FFA05F"> {order.give_receivetype} </Typography>
            </Box>
          }
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <AvatarComponent avatar={isShowReceiver ? order.avatarreceive : order.avatar} onClick={(event: any) => handleNavigateToUserProfile(isShowReceiver ? order.useridreceive : order.userid, event)} username={order.firstname} />
              {/* <Avatar alt="Avatar" src={order.avatar} component='div' 
                onClick={(event: any) => handleNavigateToUserProfile(order.userid, event)}/> */}
              <Box sx={{ ml: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                  {
                    order.username === undefined ? 
                    <Typography fontWeight="bold" variant="body1" color="initial"
                      component='div'
                      onClick={(event: any) => handleNavigateToUserProfile(isShowReceiver ? order.useridreceive : order.userid, event)}>
                        {order.username ? order.username : `${isShowReceiver ? order.firstnamereceive : order.firstname} ${isShowReceiver ? order.lastnamereceive : order.lastname}`}</Typography>
                    :
                    <Typography fontWeight="bold" variant="body1" color="initial"
                      component='div'
                      onClick={(event: any) => handleNavigateToUserProfile(isShowReceiver ? order.useridreceive : order.userid, event)}>{order.name ? order.name : `${order.name}`}</Typography>
                  }
                  
                  
                  
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <AccessTimeOutlinedIcon fontSize="small" />
                  <Typography ml={1} variant="body2" color="initial" fontStyle='italic'>{moment(order.createdat).fromNow()}</Typography>
                </Box>
              </Box>
            </Box>
            
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Typography gutterBottom variant="body1" fontWeight='bold'>Trạng thái </Typography>
            <Typography ml={1} gutterBottom variant="body1" fontWeight='bold' color="customColor.status"> {order.status} </Typography>
          </Box>

          
          
          <Typography sx={{
            height: '55px',
            overflow: 'hidden'
          }} variant="body2" color="text.secondary">
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
      {/* <Stack
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
      </Stack> */}
      
    </Card>
  );
}

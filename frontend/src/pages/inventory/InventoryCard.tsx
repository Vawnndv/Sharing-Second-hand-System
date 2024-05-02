/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, Box, CardActionArea } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatDateTime } from '../../utils/FormatDateTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import img from '../../assets/item.png';
import { useNavigate } from 'react-router-dom';

function InventoryCard({data}: any) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/inventory/${data?.orderID}`);
  };

  return (
    <Card sx={{ flex: 1 }}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent>
          <Box>
            <Box sx={{  display: 'flex', justifyContent: 'flex-end' }}>
              <Typography sx={{ml: 1, color: 'green'}} variant='body2' fontWeight='bold' fontStyle='italic'>{data?.status}</Typography>
            </Box>
            <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
              <Avatar alt={data?.giver.firstName} src={data?.giver.avatar} sx={{ width: 56, height: 56 }}/>
              <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                  <Typography variant='h6' fontWeight='bold'>{data?.giver.firstName} {data?.giver.lastName}</Typography>
                  <AccessTimeIcon />
                  <Typography variant='body2'>{formatDateTime(data?.timeStart)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                  <LocationOnOutlinedIcon />
                  <Typography variant='body2'>{data?.addressGive.address}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                  <LocationOnOutlinedIcon color='error' />
                  <Typography variant='body2'>{data?.addressReceive.address}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
              <img src={img} alt="Image" style={{ maxWidth: '70px', height: 'auto' }} />
              <Typography sx={{ml: 1}} variant='body2' fontWeight='bold'>{data?.item.quantity} - {data?.item.name}</Typography>
            </Box>
            <Box sx={{  display: 'flex', justifyContent: 'flex-end' }}>
              <Typography sx={{ml: 1, color: 'red'}} variant='body2' fontStyle='italic'>Ngày hết hạn {formatDateTime(data?.timeEnd)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default InventoryCard
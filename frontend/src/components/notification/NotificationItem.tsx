/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, MouseEvent } from 'react';
import './style.scss';

import { Stack, Typography, IconButton } from '@mui/material';
import moment from 'moment';
import 'moment/locale/vi';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotificationModel } from './Notification';
import { useNavigate } from 'react-router-dom';
import AvatarComponent from '../AvatarComponent';

type UserItemPros = {
  item: NotificationModel;
  onDeletePressed: (id: string) => void;
  updateRead: (id: string) => void;
};

function NotificationItem({ item, onDeletePressed, updateRead }: UserItemPros) {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    moment.locale('vi'); // Set locale to Vietnamese
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleRemoveNotification = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent
    onDeletePressed(item.id);
  };

  function removeNullsFromName(name: string) {
    return name.split(' ').filter(word => word && word !== "null" && word !== "undefined").join(' ');
  }
  
  return (
    <Stack
      key={item.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {navigate(`${item.link}`); updateRead(item.id);}}
      sx={{
        cursor: 'pointer', /* Add a pointer cursor for hover indication */
        '&:hover': { /* Apply styles on hover */
          backgroundColor: '#A3A3A3',
          color: '#FFFFFF',
          mb: '2px'
        },
        transition: 'background-color 0.1s linear',
        backgroundColor: item.isRead ? '#ffffff' : '#d0e3ff',
        borderBottom: '2px solid #DFE0DF' 
      }}
      px={2}
    >
      <Stack direction='row' alignItems='center' spacing={2} mt={1} pb={2} sx={{ }}>
        {/* <Avatar src={item.avatar} /> */}
        <AvatarComponent avatar={item.avatar} username={removeNullsFromName(item.name)} size={60} />
        <Stack flexGrow={1}>
          <Typography variant="body1" color="initial" component="div">
            <span style={{ fontWeight: 'bold' }}>{removeNullsFromName(item.name)}</span> {item.body}
          </Typography>
            <Typography variant='body1' sx={{ opacity: '0.75' }} fontSize={14}>
              {moment(item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000).fromNow()}
            </Typography>
        </Stack>
        {isHovered && (
        <IconButton
          size="large"
          color="error"
          sx={{
            // padding: 1,
            // marginLeft: 'auto',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#f8d7da', // Light red for hover effect
            },
          }}
          onClick={handleRemoveNotification}
        >
          <DeleteIcon />
        </IconButton>
      )}
      </Stack>
    </Stack>
  );
}

export default NotificationItem;

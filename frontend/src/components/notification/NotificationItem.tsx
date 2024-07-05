/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, MouseEvent } from 'react';
import './style.scss';

import { Avatar, Stack, Typography, IconButton } from '@mui/material';
import moment from 'moment';
import 'moment/locale/vi';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotificationModel } from './Notification';
import { useNavigate } from 'react-router-dom';

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
          color: '#FFFFFF'
        },
        transition: 'background-color 0.1s linear',
        backgroundColor: item.isRead ? '#ffffff' : '#d0e3ff'
      }}
      px={2}
    >
      <Stack direction='row' alignItems='center' spacing={2} mt={1} pb={2} sx={{ borderBottom: '2px solid #DFE0DF' }}>
        <Avatar src={item.avatar} />
        <Stack flexGrow={1}>
          <Typography >
            <Typography component="span" sx={{ fontWeight: 'bold' }}>{item.name} </Typography>
            {item.body}
          </Typography>
          <Typography variant='body1' sx={{ opacity: '0.75' }}>
            {moment(item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000).fromNow()}
          </Typography>
        </Stack>
        {isHovered && (
          <Stack sx={{ backgroundColor: 'red', height: '100%', width: '100px'}}>
            <IconButton
              size="large"
              color="inherit"
              sx={{ padding: 0, marginLeft: 'auto' }}
              onClick={handleRemoveNotification}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default NotificationItem;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, MouseEvent } from 'react';
import './style.scss';

import { Avatar, Stack, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import moment from 'moment';
import 'moment/locale/vi';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { NotificationModel } from './Notification';

type UserItemPros = {
  item: NotificationModel;
  onDeletePressed: (id: string) => void;
  updateRead: (id: string) => void;
};

function NotificationItem({ item, onDeletePressed, updateRead }: UserItemPros) {
  // eslint-disable-next-line no-unused-vars
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    moment.locale('vi'); // Set locale to Vietnamese
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMoreClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = () => {
    updateRead(item.id);
    handleClose();
  };

  const handleRemoveNotification = () => {
    onDeletePressed(item.id);
    handleClose();
  };

  return (
    <Stack
      key={item.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        <Stack>
          <Typography variant='body1'>
            <Typography variant='body1' component="span" sx={{ fontWeight: 'bold' }}>{item.name} </Typography>
            {item.body}
          </Typography>
          <Stack direction='row' alignContent="center" justifyContent="space-between">
            <Typography variant='body1' sx={{ opacity: '0.75' }}>
              {moment(item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000).fromNow()}
            </Typography>
            <IconButton
              size="large"
              color="inherit"
              sx={{ padding: 0}}
              onClick={handleMoreClick}
            >
              <MoreHorizIcon/>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleMarkAsRead}>Đánh dấu đã đọc</MenuItem>
              <MenuItem onClick={handleRemoveNotification}>Gỡ thông báo</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default NotificationItem;

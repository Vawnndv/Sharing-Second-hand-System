/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { format } from 'date-fns';

function MessageItem({ messages, typeChat }: any) {
  const { userInfo } = useSelector((state: RootState) => state.userLogin);
  const userID = userInfo?.id;

  return (
    <Box>
      {messages.map((message: any, index: any) => {
        const createdAt = message?.createdAt?.toDate ? message.createdAt.toDate() : new Date();
        const formattedTime = format(createdAt, 'MM/dd/yyyy HH:mm');

        return userID !== message?.userid ? (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-start', my: 1, ml: 2 }}>
            <Box sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'flex-start' }}>
              {typeChat === 3 && (
                <Typography variant='body2' fontStyle='italic' sx={{ opacity: 0.5 }}>
                  {message?.username}
                </Typography>
              )}
              {message?.type === 'image' ? (
                <Box>
                  <img src={message?.text} alt="Image" style={{ maxWidth: '100%', height: 'auto' }} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 1,
                    borderRadius: 5,
                    backgroundColor: '#bbdefb',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography sx={{ padding: 1 }}>
                    {message?.text}
                  </Typography>
                </Box>
              )}
              <Typography variant='caption' sx={{ mt: 0.5, opacity: 0.5 }}>
                {formattedTime}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-end', my: 1, mr: 2 }}>
            <Box sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'flex-start' }}>
              {typeChat === 3 && (
                <Typography variant='body2' fontStyle='italic' sx={{ opacity: 0.5 }}>
                  {message?.username}
                </Typography>
              )}
              {message?.type === 'image' ? (
                <Box>
                  <img src={message?.text} alt="Image" style={{ maxWidth: '100%', height: 'auto' }} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 1,
                    borderRadius: 5,
                    backgroundColor: 'gray',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography sx={{ padding: 1 }}>
                    {message?.text}
                  </Typography>
                </Box>
              )}
              <Typography variant='caption' sx={{ mt: 0.5, opacity: 0.5 }}>
                {formattedTime}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default MessageItem;

/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Typography } from '@mui/material'
import React from 'react'

const userID = '30'

function MessageItem({messages, typeChat}: any) {
  return (
    <Box>
      {
        messages.map((message : any, index : any) => {
          return (
              userID !== message?.userid ? (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-start', marginVertical: 5, marginLeft: 10 }}>
                  <Box sx={{flexDirection: 'column', display: 'flex', justifyContent: 'flex-start'}}>
                    {
                      typeChat === 3 && <Typography variant='body2' fontStyle='italic' sx={{opacity: 0.5}}>{message?.username}</Typography>
                    }
                    {
                      message?.type === 'image' ? (
                        <Box>
                          <img src={message?.text} alt="Image" style={{ maxWidth: '100%', height: 'auto' }} />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'inline-block', paddingHorizontal: 10, borderRadius: 5, backgroundColor: '#bbdefb' }}>
                          <Typography sx={{ padding: 1, px: 3 }}>
                            {message?.text}
                          </Typography>
                        </Box>
                      )
                    }
                  </Box>
                </Box>  
              ) : (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-end', marginVertical: 5, marginRight: 10 }}>
                  <Box sx={{flexDirection: 'column', display: 'flex', justifyContent: 'flex-start'}}>
                    {
                      typeChat === 3 && <Typography variant='body2' fontStyle='italic' sx={{opacity: 0.5}}>{message?.username}</Typography>
                    }
                    {
                      message?.type === 'image' ? (
                        <Box>
                          <img src={message?.text} alt="Image" style={{ maxWidth: '100%', height: 'auto' }} />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'inline-block', paddingHorizontal: 10, borderRadius: 5, backgroundColor: 'gray' }}>
                          <Typography sx={{ padding: 1, px: 3 }}>
                            {message?.text}
                          </Typography>
                        </Box>
                      )
                    }
                  </Box>
                </Box>  
              )
            )

            }
          )
      }
    </Box>
  )
}

export default MessageItem
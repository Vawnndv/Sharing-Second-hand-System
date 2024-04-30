import { Box, Typography } from '@mui/material'
import React from 'react'

const userID = '30'

function MessageItem({messages}: any) {
  return (
    <Box>
      {
        messages.map((message : any, index : any) => {
          return (
              userID !== message?.userid ? (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-start', marginVertical: 5, marginRight: 10 }}>
                  <Box sx={{ display: 'inline-block', paddingHorizontal: 10, borderRadius: 5, backgroundColor: '#bbdefb' }}>
                    <Typography sx={{ padding: 1, px: 3 }}>
                      {message?.text}
                    </Typography>
                  </Box>
                </Box>

              ) : (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'flex-end', marginVertical: 5, marginRight: 10 }}>
                  <Box sx={{ display: 'inline-block', paddingHorizontal: 10, borderRadius: 5, backgroundColor: 'gray' }}>
                    <Typography sx={{ padding: 1, px: 3 }}>
                      {message?.text}
                    </Typography>
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
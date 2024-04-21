import { Box, CircularProgress } from '@mui/material'

function Loader() {
  return (
    <Box sx={{ display: 'flex', width: '100%', padding: '1rem 0.5rem', alignItems: 'center', flexDirection:'column', justifyContent:'center' }}>
      <CircularProgress />
    </Box>
  )
}

export default Loader
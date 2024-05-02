import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InputCardScreen from './inputcard/InputCardScreen';
import OutputCardScreen from './outputcard/OutputCardScreen';
import { Container, TextField } from '@mui/material';

function InventoryScreen() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', px: 10, py: 5 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example"
            sx={{
              ".Mui-selected": {
                backgroundColor: 'customColor.muted',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 10,
                fontWeight: 'bold',
              }
            }}
          >
            <Tab label="Phiếu nhập" value="1" />
            <Tab label="Phiếu xuất" value="2" />
            <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', py: 0.8 }}>
              <TextField sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: 100,
                    m: 1,
                  },
                },
              }}
                id="outlined-basic" label="Tìm kiếm mã đơn hàng" variant="outlined" />
            </Container>
          </TabList>
        </Box>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="1">
          <InputCardScreen />
        </TabPanel>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="2">
          <OutputCardScreen />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default InventoryScreen
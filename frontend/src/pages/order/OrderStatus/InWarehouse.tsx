import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ViewOrders from '../ViewOrders';

export default function InWarehouse() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example"
            sx={{
              ".Mui-selected": {
                backgroundColor: 'customColor.muted',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 10,
                fontWeight: 'bold'
              }
            }}
          >
            <Tab label="Chờ vào kho" value="1" />
            <Tab label="Chờ nhận hàng" value="2" />
            <Tab label="Đã nhận hàng" value="3" />
            <Tab label="Trễ hạn nhận" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ViewOrders locationOfItem={1} status={1} />
        </TabPanel>
        <TabPanel value="2">
          <ViewOrders locationOfItem={1} status={2} />
        </TabPanel>
          <TabPanel value="3">
          <ViewOrders locationOfItem={1} status={3} />
        </TabPanel>
        <TabPanel value="4">
          <ViewOrders locationOfItem={1} status={4} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
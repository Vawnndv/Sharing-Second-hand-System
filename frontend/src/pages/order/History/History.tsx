import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ViewOrders from '../ViewOrders';

export default function LabTabs() {
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
                fontWeight: 'bold'
              }
            }}
          >
            <Tab label="Trong kho" value="1" />
            <Tab label="Ngoài kho" value="2" />
          </TabList>
        </Box>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="1">
          <ViewOrders locationOfItem={1} />
        </TabPanel>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="2">
          <ViewOrders locationOfItem={2} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

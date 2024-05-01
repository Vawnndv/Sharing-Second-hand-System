import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ViewInventoryList from '../ViewInventoryList';

function InputCardScreen() {
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
            <Tab label="Chờ lấy" value="1" />
            <Tab label="Đã lấy" value="2" />
            <Tab label="Chờ đem đến" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ViewInventoryList typeCard={1} status={1} />
        </TabPanel>
        <TabPanel value="2">
          <ViewInventoryList typeCard={1} status={2} />
        </TabPanel>
          <TabPanel value="3">
          <ViewInventoryList typeCard={1} status={3} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default InputCardScreen
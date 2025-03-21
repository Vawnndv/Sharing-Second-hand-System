import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PostReport from './PostReport';
import UserReport from './UserReport';

function ReportScreen() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{minHeight: '100vh', typography: 'body1', px: 10, py: 5 }}>
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
            <Tab label="Bài đăng" value="1" />
            <Tab label="Người dùng" value="2" />
          </TabList>
        </Box>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="1">
          <PostReport />
        </TabPanel>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="2">
          <UserReport />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default ReportScreen
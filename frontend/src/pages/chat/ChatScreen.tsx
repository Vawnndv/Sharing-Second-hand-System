import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

function ChatScreen() {
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
            <Tab label="Cộng tác viên" value="1" />
            <Tab label="Người dùng" value="2" />
            <Tab label="Kho" value="3" />
          </TabList>
        </Box>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="1">
          <ChatList typeChat={1} />
        </TabPanel>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="2">
          <ChatList typeChat={2} />
        </TabPanel>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="3">
          {/* <ChatList typeChat={3} /> */}
          <ChatRoom typeChat={3}/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default ChatScreen
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';
import { Container, IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

function ChatScreen() {
  const [value, setValue] = React.useState('1');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', px: 10, py: 5 }}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            py: 0.8,
          }}
        >
          <TextField
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: 100,
                  m: 1,
                },
              },
            }}
            id="outlined-basic"
            label="Tìm kiếm"
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Container>
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
          <ChatList searchQuery={searchQuery} typeChat={1} />
        </TabPanel>
        <TabPanel sx={{m: 0, p: 0, mt: 1}} value="2">
          <ChatList searchQuery={searchQuery} typeChat={2} />
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
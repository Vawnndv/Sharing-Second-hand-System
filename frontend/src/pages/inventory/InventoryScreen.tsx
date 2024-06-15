import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InputCardScreen from './inputcard/InputCardScreen';
import OutputCardScreen from './outputcard/OutputCardScreen';
import {
  Container,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import FilterModal from '../../modal/FilterModal/FilterModal';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { category } from '../../constant/appCategories';


function InventoryScreen() {
  const [value, setValue] = useState('1');
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [filterValue, setFilterValue] = useState({
    distance: -1,
    time: -1,
    category,
    sort: 'Mới nhất',
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  return (
    <Stack direction="row">
      <Stack direction="row">
        <FilterModal
          isShowFilter={isShowFilter}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
        <IconButton
          sx={{
            height: 40,
            backgroundColor: '#C8CFF2',
            border: '1px solid #BA9FD3',
            boxShadow: '0px 0px 2px 2px #E5E5E5',
            marginTop: '20vh',
            ml: -4.5,
            mr: 5,
            zIndex: 1,
            borderRadius: 0,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          }}
          onClick={() => setIsShowFilter(!isShowFilter)}
        >
          {isShowFilter ? (
            <ArrowBackIosOutlinedIcon color="primary" />
          ) : (
            <ArrowForwardIosOutlinedIcon color="primary" />
          )}
        </IconButton>
      </Stack>
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
            label="Tìm kiếm mã đơn hàng"
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
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{
                '.Mui-selected': {
                  backgroundColor: 'customColor.muted',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 10,
                  fontWeight: 'bold',
                },
              }}
            >
              <Tab label="Phiếu nhập" value="1" />
              <Tab label="Phiếu xuất" value="2" />
            </TabList>
          </Box>
          <TabPanel sx={{ m: 0, p: 0, mt: 1 }} value="1">
            <InputCardScreen
              filterValue={filterValue}
              searchQuery={searchQuery}
            />
          </TabPanel>
          <TabPanel sx={{ m: 0, p: 0, mt: 1 }} value="2">
            <OutputCardScreen
              searchQuery={searchQuery}
              filterValue={filterValue}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}

export default InventoryScreen;

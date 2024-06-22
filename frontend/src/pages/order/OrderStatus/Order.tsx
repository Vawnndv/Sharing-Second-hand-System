import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InWarehouse from './InWarehouse';
import OutOfWarehouse from './OutOfWarehouse';
import { IconButton, Stack } from '@mui/material';
import FilterModal from '../../../modal/FilterModal/FilterModal';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useState } from 'react';
import { category } from '../../../constant/appCategories';


export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [isShowFilter, setIsShowFilter] = useState(false)

  const [filterValue, setFilterValue] = useState({
    distance: -1,
    time: -1,
    category,
    sort: 'Mới nhất'
  })

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Stack direction='row'>
      <Stack direction='row'>
        <FilterModal isShowFilter={isShowFilter} filterValue={filterValue} setFilterValue={setFilterValue}/>
        <IconButton sx={{height: 40, backgroundColor: '#C8CFF2', border: '1px solid #BA9FD3', boxShadow: '0px 0px 2px 2px #E5E5E5',
          marginTop: '20vh', ml: -4.5, mr: 5, zIndex: 1, borderRadius: 0, borderTopRightRadius: 20, borderBottomRightRadius: 20
        }}
          onClick={() => setIsShowFilter(!isShowFilter)}>
          {
            isShowFilter ? <ArrowBackIosOutlinedIcon color="primary"/> : <ArrowForwardIosOutlinedIcon color="primary"/>
          }
        </IconButton>
        
      </Stack>
      <Box sx={{ width: '100%', typography: 'body1', px: 1, py: 5 }}>
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
              <Tab label="Thông qua kho" value="1" />
              <Tab label="Không thông qua kho" value="2" />
            </TabList>
          </Box>
          <TabPanel sx={{m: 0, p: 0, mt: 1}} value="1">
            <InWarehouse  filterValue={filterValue}/>
          </TabPanel>
          <TabPanel sx={{m: 0, p: 0, mt: 1}} value="2">
            <OutOfWarehouse  filterValue={filterValue}/>
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}

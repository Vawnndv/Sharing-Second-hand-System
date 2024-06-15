/* eslint-disable array-callback-return */
import { IconButton, Stack } from "@mui/material";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useEffect, useState } from "react";
import FilterModal from "../../modal/FilterModal/FilterModal";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import Axios from "../../redux/APIs/Axios";
import PostComponent from "./PostComponent";
import { category } from "../../constant/appCategories";


function PostApproval() {
  // const dispatch: AppDispatch = useAppDispatch();
  // const navigate = useNavigate();

  // const logoutHandler = () => {
  //   dispatch(logoutAction())
  //   toast.success('Logged out successfully')
  //   navigate('login')
  // }

  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [isShowFilter, setIsShowFilter] = useState(false)

  const [filterValue, setFilterValue] = useState({
    distance: -1,
    time: -1,
    category,
    sort: 'Mới nhất'
  })

  const [warehousesID, setWarehousesID] = useState([])

  useEffect(() => {
    const fetchDataWarehouses = async () => {
      const response: any = await Axios.get('/warehouse')
      console.log("WAREHOUSES",response)
      const listWarehouseID: any = []
      response.wareHouses.map((warehouse: any) => {
        listWarehouseID.push(warehouse.warehouseid)
      })
      setWarehousesID(listWarehouseID)
    }
    fetchDataWarehouses()
  }, [])

  return( 

    <Stack
      direction='row'>
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
      
      <Box sx={{ width: '100%', typography: 'body1', py: 5 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
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
              <Tab label="Đang chờ xét duyệt" value="1" sx={{paddingX: 3}}/>
              <Tab label="Vừa duyệt" value="2" sx={{paddingX: 3}} />
              <Tab label="Vừa hủy" value="3" sx={{paddingX: 3}} />
            </TabList>
          </Box>
          <TabPanel value="1">
            <PostComponent filterValue={filterValue} warehousesID={warehousesID} status="Chờ xét duyệt" statusTotalPosts="waitForApprove" canApproval/>
          </TabPanel>
          <TabPanel value="2">
            <PostComponent filterValue={filterValue} warehousesID={warehousesID} status="Vừa duyệt" statusTotalPosts="justApprove" canDelete/>
          </TabPanel>
          <TabPanel value="3">
            <PostComponent filterValue={filterValue} warehousesID={warehousesID} status="Vừa hủy" statusTotalPosts="justCancel" canApproval/>
          </TabPanel>
          
        </TabContext>

      </Box>
    </Stack>
    
  )
}

export default PostApproval;

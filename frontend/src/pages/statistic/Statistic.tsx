import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Autocomplete, Box, Button, Checkbox, FormControl, MenuItem, Modal, Radio, Select, Stack, Tab, TextField, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import React, { useEffect, useState } from 'react';
import ChartComponent from '../../components/Chart/ChartComponentCollaborator';
import { useSelector } from 'react-redux';
import MapSelectWarehouses from '../../components/Map/MapSelectWarehouses';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from '../../components/DatePicker';
import ChartComponentFollowTime from '../../components/Chart/ChartComponentFollowTime';
import ChartComponentFollowTimeCollaborator from '../../components/Chart/ChartComponentFollowTimeCollaborator';
import Axios from '../../redux/APIs/Axios';
// import MapSelectAddress from '../../components/Map/MapSelectAddress';
const category = [
    "Quần áo",
    "Giày dép",
    "Đồ nội thất",
    "Công cụ",
    "Dụng cụ học tập",
    "Thể thao",
    "Khác"
  ]

function ChartTypeComponent ({typeChart, setTypeChart}: any) {
    return (
        <Stack
            flexDirection='column' sx={{width: '150px'}}>
            <Typography variant='body1' sx={{fontWeight: 'bold', p: 1}}>Loại biểu đồ</Typography>
            <Typography variant='body2' sx={{borderLeft: `3px solid ${typeChart === 'line' ? '#6A1D70' : '#CCCCCC'}`, ml: -3, p: 1, pl: 3, cursor: 'pointer'}}
                component='div' onClick={() => setTypeChart('line')}>Đường</Typography>
            <Typography variant='body2' sx={{borderLeft: `3px solid ${typeChart === 'bar' ? '#6A1D70' : '#CCCCCC'}`, ml: -3, p: 1, pl: 3, cursor: 'pointer'}}
                component='div' onClick={() => setTypeChart('bar')}>Cột</Typography>
            <Typography variant='body2' sx={{borderLeft: `3px solid ${typeChart === 'pie' ? '#6A1D70' : '#CCCCCC'}`, ml: -3, p: 1, pl: 3, cursor: 'pointer'}}
                component='div' onClick={() => setTypeChart('pie')}>Tròn</Typography>
            {/* <Typography variant='body2' sx={{borderLeft: `3px solid ${typeChart === 'polarArea' ? '#6A1D70' : '#CCCCCC'}`, ml: -3, p: 1, pl: 3, cursor: 'pointer'}}
                component='div' onClick={() => setTypeChart('polarArea')}>Polar</Typography>
            <Typography variant='body2' sx={{borderLeft: `3px solid ${typeChart === 'radar' ? '#6A1D70' : '#CCCCCC'}`, ml: -3, p: 1, pl: 3, cursor: 'pointer'}}
                component='div' onClick={() => setTypeChart('radar')}>Radar</Typography> */}
        </Stack>
    )
}

function SelectWarehouse({warehouses, warehousesSelected, handleSelectWarehouses}: any) {
    // Danh sách các kho

  
    return (
      <Box sx={{ width: 300, mb: 2 }}>
        <Autocomplete
          sx={{height: '50px'}}
          disablePortal
          multiple
          options={warehouses}
          disableCloseOnSelect
          renderOption={(props, option: any) => (
            <Button key={option.warehouseid} style={{cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'flex-start'}}
                onClick={() => handleSelectWarehouses(option.warehouseid)}>
              <Checkbox checked={warehousesSelected[warehouses.findIndex((warehouse: any) => warehouse.warehouseid === option.warehouseid)]} />
              {option.label}
            </Button>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              name="Chọn kho"
              placeholder="Chọn kho"
            />
          )}
        />
      </Box>
    );
}

function SelectCategory({categoryIndex, handleSelectCategory}: any) {
    // Danh sách các kho

  
    return (
      <Box sx={{ width: 300, mb: 2 }}>
        <Autocomplete
          sx={{height: '50px'}}
          disablePortal
          multiple
          options={category}
          disableCloseOnSelect
          renderOption={(props, option: any) => (
            <Button key={option} style={{cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'flex-start'}}
                onClick={() => handleSelectCategory(category.findIndex((item: string) => item === option))}>
              <Radio checked={option === category[categoryIndex]} />
              {option}
            </Button>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              name="Loại đồ"
              placeholder="Loại đồ"
            />
          )}
        />
      </Box>
    );
}


function Statistic() {

    const userLogin = useSelector((state: any) => state.userLogin);

    const [tabValue, setTabValue] = useState('Lượng sản phẩm vào/ra kho')
    const [tabImportExportValue, setTabImportExportValue] = useState('Thống kê theo loại');

    const today = dayjs();
    const [date, setDate] = React.useState<[Dayjs, Dayjs]>([dayjs('2024-06-01'), today]);
    console.log(date)
    const handleChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };
    const handleChangeTabImportExport = (event: any, newValue: any) => {
        setTabImportExportValue(newValue);
    };

    const [typeChart, setTypeChart] = useState('line')
    const [typeItemInOut, setTypeItemInOut] = useState('import')
    const handleChangeItemInOut = (event: any, newValue: any) => {
        setTypeItemInOut(newValue.props.value);
    };

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [warehouses, setWarehouses] = useState<any>([]);
    
    const [warehousesSelected, setWarehousesSelected] = useState<boolean[]>([])

    const [categoryIndex, setCategoryIndex] = useState<number>(0);

    const [apply, setApply] = useState(false)

    const handleSelectWarehouses = (id: number) => {
        
        const newWarehousesSelected = [...warehousesSelected]
        const indexSelect = warehouses.findIndex((warehouse: any) => warehouse.warehouseid === id)
        newWarehousesSelected[indexSelect] = !newWarehousesSelected[indexSelect]
        setWarehousesSelected(newWarehousesSelected)
    }

    const handleSelectCategory = (index: number) => {
        setCategoryIndex(index)
    }

    useEffect(() => {
        const fetchDataWarehouses = async () => {
            try {
                setIsLoading(true)
                const response: any = await Axios.get(`warehouse`)
                const tempWarehouses = response.wareHouses
                
                for(let i = 0; i < tempWarehouses.length; i+=1){
                    tempWarehouses[i].label = tempWarehouses[i].warehousename
                }
                setWarehousesSelected(Array.from({length: tempWarehouses.length}, () => true))
                setWarehouses(tempWarehouses)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            }
            
        }
        
        fetchDataWarehouses()
    }, [])
    
    useEffect(() => {
        const fetchDataCollaborator = async () => {
            let response;
            if(tabValue === "Lượng đăng bài"){
                try{
                    setIsLoading(true)
                    response = await Axios.post(`statistic/statisticAccessUser`,{
                            type: 'post',
                            timeStart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`,
                            timeEnd: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`
                        }
                    )
                } catch(error){
                    console.log(error)
                } 
            }
            else if(tabValue === "Lượng người truy cập"){
                try{
                    setIsLoading(true)
                    response = await Axios.post(`statistic/statisticAccessUser`,{
                            type: 'access',
                            timeStart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`,
                            timeEnd: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`
                        }
                    )
                } catch(error){
                    console.log(error)
                } 
            }
            else if(tabValue === "Lượng sản phẩm vào/ra kho"){
                try{
                    setIsLoading(true)
                    response = await Axios.post(`statistic/statisticImportExport`,{
                        userID: userLogin.userInfo.id,
                        type: typeItemInOut,
                        timeStart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`,
                        timeEnd: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`,
                    })
                } catch(error){
                    console.log(error)
                }                
            } else {
                try {
                    setIsLoading(true)
                    response = await Axios.get(`statistic/statisticInventory?userID=${userLogin.userInfo.id}`)
                } catch (error) {
                    console.log(error)
                }                
            }
            if(response){
                setData(response.data);
                setIsLoading(false)
            }
        }

        const fetchDataAdmin = async () => {
            let response;
            if(tabValue === "Lượng đăng bài"){
                try{
                    setIsLoading(true)
                    response = await Axios.post(`statistic/statisticAccessUser`,{
                            type: 'post',
                            timeStart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`,
                            timeEnd: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`
                        }
                    )
                } catch(error){
                    console.log(error)
                } 
            }
            else if(tabValue === "Lượng người truy cập"){
                try{
                    setIsLoading(true)
                    response = await Axios.post(`statistic/statisticAccessUser`,{
                            type: 'access',
                            timeStart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`,
                            timeEnd: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`
                        }
                    )
                } catch(error){
                    console.log(error)
                } 
            }
            else if(tabValue === "Lượng sản phẩm vào/ra kho"){
                try{
                    setIsLoading(true)
                    const listWarehousesSelected = []
                    for(let i = 0; i < warehousesSelected.length; i+=1){
                        if(warehousesSelected[i]) {
                            listWarehousesSelected.push(warehouses[i])
                        }
                    }
                    if(tabImportExportValue === 'Thống kê theo loại'){
                        response = await Axios.post(`statistic/statisticImportExportAdmin`,{
                            type: typeItemInOut,
                            warehouses: listWarehousesSelected,
                            timeStart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`,
                            timeEnd: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`,
                        })
                    }else{
                        response = await Axios.post(`statistic/statisticImportExportFollowTimeAdmin`,{
                            type: typeItemInOut,
                            warehouses: listWarehousesSelected,
                            category: category[categoryIndex],
                            timeStart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`,
                            timeEnd: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`,
                        })
                    }
                    
                } catch(error){
                    console.log(error)
                }                
            } else {
                try {
                    setIsLoading(true)
                    const listWarehousesSelected = []
                    for(let i = 0; i < warehousesSelected.length; i+=1){
                        if(warehousesSelected[i]) {
                            listWarehousesSelected.push(warehouses[i])
                        }
                    }
                    response = await Axios.post(`statistic/statisticInventoryAdmin`,{
                        warehouses: listWarehousesSelected
                    })
                } catch (error) {
                    console.log(error)
                }                
            }
            if(response){
                setData(response.data);
                setIsLoading(false)
                console.log(response.data)
            }
        }

        if(userLogin.userInfo.roleID === 2){
            fetchDataCollaborator()
        }else{
            fetchDataAdmin()
        }
        
    }, [tabValue, tabImportExportValue, typeItemInOut, apply, warehouses])


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        height: '95%',
        bgcolor: 'background.paper',
        border: '2px solid #CAC9C8',
        boxShadow: '1px 1px 2px #CAC9C8',
    };
    console.log("DATA", data)

    // const [location, setLocation] = useState<any>(null)
    return ( 
        <div>
            {
                (data.length > 0 && !isLoading && warehousesSelected.length > 0) ?
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, ml: 2 }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Lượng đăng bài" value="Lượng đăng bài" />
                        <Tab label="Lượng người truy cập" value="Lượng người truy cập" />
                        <Tab label="Lượng sản phẩm vào/ra kho" value="Lượng sản phẩm vào/ra kho" />
                        <Tab label="Lượng hàng tồn kho" value="Lượng hàng tồn kho" />
                        </TabList>
                    </Box>
                    <TabPanel value="Lượng đăng bài"
                        sx={{display: 'flex', flexDirection: 'column', ml: 4}}>
                        <Stack
                            flexDirection='row'>
                            <Stack sx={{mb: 1}}>
                                <DatePicker date={date} setDate={setDate}/>
                            </Stack>
                            
                        </Stack>
                        <Stack
                            flexDirection='row'>
                            <ChartComponent data={data} title='Lượng bài đăng' typeChart={typeChart}/>
                            <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
                        </Stack>
                    </TabPanel>
                    <TabPanel value="Lượng người truy cập"
                        sx={{display: 'flex', flexDirection: 'column', ml: 4}}>
                        <Stack
                            flexDirection='row'>
                            <Stack sx={{mb: 1}}>
                                <DatePicker date={date} setDate={setDate}/>
                            </Stack>
                            
                        </Stack>
                        <Stack
                            flexDirection='row'>
                            <ChartComponent data={data} title='Lượng người truy cập' typeChart={typeChart}/>
                            <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
                        </Stack>
                    </TabPanel>
                    <TabPanel value="Lượng sản phẩm vào/ra kho"
                        sx={{display: 'flex', flexDirection: 'column', ml: 4}}>

                            {
                                userLogin.userInfo.roleID === 3 ?
                                <TabContext value={tabImportExportValue}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', ml: 2 }}>
                                        <TabList onChange={handleChangeTabImportExport} aria-label="lab API tabs example">
                                        <Tab label="Thống kê theo loại" value="Thống kê theo loại" />
                                        <Tab label="Thống kê theo thời gian" value="Thống kê theo thời gian" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value='Thống kê theo loại'>
                                        <Stack
                                            flexDirection='row'>
                                            <SelectWarehouse warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/>
                                            
                                            <div>
                                                <Button sx={{height: '55px', ml: 1}} variant="outlined" endIcon={<TouchAppOutlinedIcon />}
                                                    onClick={handleOpen}>
                                                    Bản đồ
                                                </Button>
                                                <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <MapSelectWarehouses warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/>
                                                        {/* <MapSelectAddress setLocation={setLocation}/> */}
                                                    </Box>
                                                </Modal>
                                            </div>
                                            <Button sx={{height: '55px', ml: 1, backgroundColor: '#DCFFF0'}} variant="outlined"
                                                onClick={() => setApply(!apply)}>
                                                Áp dụng
                                            </Button>
                                        </Stack>

                                        <Stack
                                            flexDirection='row'>
                                            <Stack sx={{mb: 1}}>
                                                <DatePicker date={date} setDate={setDate}/>
                                            </Stack>
                                            
                                        </Stack>
                                        
                                        <FormControl
                                            sx={{width: '200px'}}>
                                            <Select
                                                labelId="dropdown-label"
                                                id="dropdown"
                                                value={typeItemInOut}
                                                onChange={handleChangeItemInOut}
                                            >
                                                <MenuItem value="import">Vào kho</MenuItem>
                                                <MenuItem value="export">Ra kho</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Stack
                                            flexDirection='row'>
                                            <ChartComponent data={data} title='Lượng sản phẩm vào/ra kho' typeChart={typeChart}/>
                                            <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
                                        </Stack>
                                    </TabPanel>

                                    <TabPanel value='Thống kê theo thời gian'>
                                        <Stack
                                            flexDirection='row'>
                                            
                                            <SelectCategory categoryIndex={categoryIndex} handleSelectCategory={handleSelectCategory}/>
                                            <Stack sx={{ ml: 1, mt: -1}}>
                                                <DatePicker date={date} setDate={setDate}/>
                                            </Stack>
                                            
                                        </Stack>
                                        <Stack
                                            flexDirection='row'>
                                            <SelectWarehouse warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/>
                                            
                                            <div>
                                                <Button sx={{height: '55px', ml: 1}} variant="outlined" endIcon={<TouchAppOutlinedIcon />}
                                                    onClick={handleOpen}>
                                                    Bản đồ
                                                </Button>
                                                <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <MapSelectWarehouses warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/>
                                                        {/* <MapSelectAddress setLocation={setLocation}/> */}
                                                    </Box>
                                                </Modal>
                                            </div>
                                            <Button sx={{height: '55px', ml: 1, backgroundColor: '#DCFFF0'}} variant="outlined"
                                                onClick={() => setApply(!apply)}>
                                                Áp dụng
                                            </Button>
                                        </Stack>

                                        <FormControl
                                            sx={{width: '200px'}}>
                                            <Select
                                                labelId="dropdown-label"
                                                id="dropdown"
                                                value={typeItemInOut}
                                                onChange={handleChangeItemInOut}
                                            >
                                                <MenuItem value="import">Vào kho</MenuItem>
                                                <MenuItem value="export">Ra kho</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Stack
                                            flexDirection='row'>
                                            <ChartComponentFollowTime data={data} title='Lượng sản phẩm vào/ra kho' typeChart={typeChart}/>
                                            <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
                                        </Stack>
                                    </TabPanel>
                                </TabContext>

                                :

                                <TabContext value={tabImportExportValue}>

                                    <Stack
                                        flexDirection='row'>
                                        <Stack sx={{mb: 1}}>
                                            <DatePicker date={date} setDate={setDate}/>
                                        </Stack>
                                        <Button sx={{height: '55px', ml: 1, backgroundColor: '#DCFFF0', mt: 1}} variant="outlined"
                                            onClick={() => setApply(!apply)}>
                                            Áp dụng
                                        </Button>
                                        
                                    </Stack>
                                    
                                    <FormControl
                                        sx={{width: '200px'}}>
                                        <Select
                                            labelId="dropdown-label"
                                            id="dropdown"
                                            value={typeItemInOut}
                                            onChange={handleChangeItemInOut}
                                        >
                                            <MenuItem value="import">Vào kho</MenuItem>
                                            <MenuItem value="export">Ra kho</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Stack
                                        flexDirection='row'>
                                        <ChartComponentFollowTimeCollaborator data={data} typeChart={typeChart}/>
                                        <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
                                    </Stack>
                                </TabContext>
                            }
    
                        
                        
                    </TabPanel>
                    <TabPanel value="Lượng hàng tồn kho"
                        sx={{display: 'flex', flexDirection: 'column', ml: 4}}>
                            
                            {
                                userLogin.userInfo.roleID === 3 &&
                                <Stack
                                    flexDirection='row'>
                                    <SelectWarehouse warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/>
                                    <div>
                                        <Button sx={{height: '55px', ml: 1}} variant="outlined" endIcon={<TouchAppOutlinedIcon />}
                                            onClick={handleOpen}>
                                            Bản đồ
                                        </Button>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={style}>
                                                <MapSelectWarehouses warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/>
                                            </Box>
                                        </Modal>
                                    </div>
                                    <Button sx={{height: '55px', ml: 1}} variant="outlined"
                                        onClick={() => setApply(!apply)}>
                                        Áp dụng
                                    </Button>
                                </Stack>
                                
                            }

                        <Stack
                            flexDirection='row'>
                            <ChartComponent data={data} title='Lượng hàng tồn kho' typeChart={typeChart}/>
                            <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
                        </Stack>
                        
                    </TabPanel>
                </TabContext>
                :
                <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            }
            
        </div>
        
    );
}

export default Statistic;
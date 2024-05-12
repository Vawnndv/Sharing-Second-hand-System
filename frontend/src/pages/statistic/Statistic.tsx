import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Autocomplete, Box, Button, Checkbox, FormControl, MenuItem, Modal, Select, Stack, Tab, TextField, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import React, { useEffect, useState } from 'react';
import ChartComponent from '../../components/Chart/ChartComponent';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MapSelectWarehouses from '../../components/Map/MapSelectWarehouses';

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
            <Typography variant='body2' sx={{borderLeft: `3px solid ${typeChart === 'polarArea' ? '#6A1D70' : '#CCCCCC'}`, ml: -3, p: 1, pl: 3, cursor: 'pointer'}}
                component='div' onClick={() => setTypeChart('polarArea')}>Polar</Typography>
            <Typography variant='body2' sx={{borderLeft: `3px solid ${typeChart === 'radar' ? '#6A1D70' : '#CCCCCC'}`, ml: -3, p: 1, pl: 3, cursor: 'pointer'}}
                component='div' onClick={() => setTypeChart('radar')}>Radar</Typography>
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

const timeArr = [
    {
        value: 1,
        label: '1 tháng'
    },
    {
        value: 2,
        label: '2 tháng'
    },
    {
        value: 3,
        label: '3 tháng'
    },
    {
        value: 6,
        label: '6 tháng'
    },
    {
        value: 12,
        label: '1 năm'
    },
    {
        value: 24,
        label: '2 năm'
    },
    {
        value: 60,
        label: '5 năm'
    }
]

function Statistic() {

    const userLogin = useSelector((state: any) => state.userLogin);

    const [tabValue, setTabValue] = useState('Lượng sản phẩm vào/ra kho')
    const handleChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    const [typeChart, setTypeChart] = useState('bar')
    const [typeItemInOut, setTypeItemInOut] = useState('import')
    const handleChangeItemInOut = (event: any, newValue: any) => {
        setTypeItemInOut(newValue.props.value);
    };

    const [timeUserAccess, setTimeUserAccess] = useState(1)
    const handleChangeTimeUserAccess = (event: any, newValue: any) => {
        setTimeUserAccess(newValue.props.value);
    };

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [warehouses, setWarehouses] = useState<any>([]);
    
    const [warehousesSelected, setWarehousesSelected] = useState<boolean[]>([])

    const [apply, setApply] = useState(false)

    const handleSelectWarehouses = (id: number) => {
        
        const newWarehousesSelected = [...warehousesSelected]
        const indexSelect = warehouses.findIndex((warehouse: any) => warehouse.warehouseid === id)
        newWarehousesSelected[indexSelect] = !newWarehousesSelected[indexSelect]
        setWarehousesSelected(newWarehousesSelected)
    }

    useEffect(() => {
        const fetchDataWarehouses = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`http://localhost:3000/warehouse/`)
                const tempWarehouses = response.data.wareHouses
                
                for(let i = 0; i < tempWarehouses.length; i+=1){
                    tempWarehouses[i].label = tempWarehouses[i].warehousename
                }
                setWarehousesSelected(Array.from({length: tempWarehouses.length}, () => true))
                setWarehouses(tempWarehouses)
                setIsLoading(false)
                console.log('fetchDataWarehouses')
            } catch (error) {
                console.log(error)
            }
            
        }
        
        fetchDataWarehouses()
    }, [])
    
    useEffect(() => {
        const fetchDataCollaborator = async () => {
            let response;
            if(tabValue === "Lượng người truy cập"){
                try{
                    setIsLoading(true)
                    response = await axios.get(`http://localhost:3000/statistic/statisticAccessUser?timeValue=${timeUserAccess}`)
                } catch(error){
                    console.log(error)
                } 
            }
            else if(tabValue === "Lượng sản phẩm vào/ra kho"){
                try{
                    setIsLoading(true)
                    response = await axios.get(`http://localhost:3000/statistic/statisticImportExport?userID=${userLogin.userInfo.id}&type=${typeItemInOut}`)
                } catch(error){
                    console.log(error)
                }                
            } else {
                try {
                    setIsLoading(true)
                    response = await axios.get(`http://localhost:3000/statistic/statisticInventory?userID=${userLogin.userInfo.id}`)
                } catch (error) {
                    console.log(error)
                }                
            }
            if(response){
                setData(response.data.data);
                console.log(response);
                setIsLoading(false)
            }
        }

        const fetchDataAdmin = async () => {
            let response;
            if(tabValue === "Lượng người truy cập"){
                try{
                    setIsLoading(true)
                    response = await axios.get(`http://localhost:3000/statistic/statisticAccessUser?timeValue=${timeUserAccess}`)
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
                    response = await axios.post(`http://localhost:3000/statistic/statisticImportExportAdmin`,{
                        type: typeItemInOut,
                        warehouses: listWarehousesSelected
                    })
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
                    response = await axios.post(`http://localhost:3000/statistic/statisticInventoryAdmin`,{
                        warehouses: listWarehousesSelected
                    })
                } catch (error) {
                    console.log(error)
                }                
            }
            if(response){
                setData(response.data.data);
                console.log(response);
                setIsLoading(false)
            }
        }

        if(userLogin.userInfo.roleID === 2){
            fetchDataCollaborator()
        }else{
            fetchDataAdmin()
        }
        
        console.log("tabValue", tabValue)
        console.log("typeItemInOut", typeItemInOut)
    }, [tabValue, typeItemInOut, timeUserAccess,apply, warehouses])

    const currentDate = new Date();
    // Ngày trong quá khứ (ví dụ: 1 tháng trước)
    const pastDate = new Date('2024-03-01');

    // Số tháng từ ngày trong quá khứ đến ngày hiện tại
    const monthsDifference = (currentDate.getFullYear() - pastDate.getFullYear()) * 12 + (currentDate.getMonth() - pastDate.getMonth());

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
    return ( 
        <div>
            {
                (data.length > 0 && !isLoading && warehousesSelected.length > 0) ?
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, ml: 2 }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Lượng người truy cập" value="Lượng người truy cập" />
                        <Tab label="Lượng sản phẩm vào/ra kho" value="Lượng sản phẩm vào/ra kho" />
                        <Tab label="Lượng hàng tồn kho" value="Lượng hàng tồn kho" />
                        </TabList>
                    </Box>
                    <TabPanel value="Lượng người truy cập"
                        sx={{display: 'flex', flexDirection: 'column', ml: 4}}>
                        <FormControl
                        sx={{width: '200px', ml: 4}}>
                            <Select
                                labelId="dropdown-label"
                                id="dropdown"
                                value={timeUserAccess}
                                onChange={handleChangeTimeUserAccess}
                            >
                                {
                                    timeArr.map((item: any, index: number) => {
                                        if(item.value <= monthsDifference){
                                            return (
                                                <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                            )
                                        }
                                        return null
                                        
                                    })
                                }
                            </Select>
                        </FormControl>
                        <Stack
                            flexDirection='row'>
                            <ChartComponent data={data} title='Lượng người truy cập' typeChart={typeChart}/>
                            <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
                        </Stack>
                    </TabPanel>
                    <TabPanel value="Lượng sản phẩm vào/ra kho"
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
    
                        <FormControl
                        sx={{width: '200px', ml: 4}}>
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
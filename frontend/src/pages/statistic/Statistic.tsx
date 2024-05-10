import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, FormControl, MenuItem, Select, Stack, Tab, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import ChartComponent from '../../components/Chart/ChartComponent';
import axios from 'axios';

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

function Statistic() {
    const [tabValue, setTabValue] = useState('Lượng sản phẩm vào/ra kho')
    const handleChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    const [typeChart, setTypeChart] = useState('bar')
    const [typeItemInOut, setTypeItemInOut] = useState('import')
    const handleChangeItemInOut = (event: any, newValue: any) => {
        setTypeItemInOut(newValue.props.value);
    };

    const [timeUserAccess, setTimeUserAccess] = useState('1 month')
    const handleChangeTimeUserAccess = (event: any, newValue: any) => {
        setTimeUserAccess(newValue.props.value);
    };

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            let response;
            if(tabValue === "Lượng sản phẩm vào/ra kho"){
                try{
                    setIsLoading(true)
                    response = await axios.get(`http://localhost:3000/statistic/statisticImportExport?userID=37&type=${typeItemInOut}`)
                } catch(error){
                    console.log(error)
                }                
            } else {
                try {
                    setIsLoading(true)
                    response = await axios.get('http://localhost:3000/statistic/statisticInventory?userID=37')
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

        fetchData()
        console.log("tabValue", tabValue)
        console.log("typeItemInOut", typeItemInOut)
    }, [tabValue, typeItemInOut, timeUserAccess])
    return ( 
        <div>
            {
                (data.length > 0 && !isLoading) ?
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
                                <MenuItem value="1 month">1 tháng</MenuItem>
                                <MenuItem value="2 month">2 tháng</MenuItem>
                                <MenuItem value="3 month">3 tháng</MenuItem>
                                <MenuItem value="6 month">6 tháng</MenuItem>
                                <MenuItem value="1 year">1 năm</MenuItem>
                                <MenuItem value="2 year">2 năm</MenuItem>
                                <MenuItem value="5 year">5 năm</MenuItem>
                                <MenuItem value="all">Tất cả</MenuItem>
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
                        sx={{display: 'flex', flexDirection: 'row', ml: 4}}>
                        <ChartComponent data={data} title='Lượng hàng tồn kho' typeChart={typeChart}/>
                        <ChartTypeComponent typeChart={typeChart} setTypeChart={setTypeChart}/>
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
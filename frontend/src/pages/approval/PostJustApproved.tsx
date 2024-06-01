import React, { useEffect, useState } from 'react';
import Axios from '../../redux/APIs/Axios';
import { Box, Pagination, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import OrderCard from '../order/OrderCard';
import { useSelector } from 'react-redux';

function PostJustApproved({filterValue, warehousesID}: any) {
    
    const userLogin = useSelector((state: any) => state.userLogin);

    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<any[]>([])
    const LIMIT = 10

    useEffect(() => {
        const fetchData = async () => {
            try{
                setIsLoading(true)
                const responseUser = await Axios.get(`/user/get-user-address?userId=${userLogin.userInfo.id}`);
                
                const responsePosts: any = await Axios.post('/posts/get-posts-by-status', {
                    status: 'Vừa duyệt',
                    page: page -1,
                    limit: LIMIT,
                    distance: filterValue.distance,
                    time: filterValue.time,
                    sort: filterValue.sort,
                    latitude: parseFloat(responseUser.data.latitude),
                    longitude: parseFloat(responseUser.data.longitude),
                    category: filterValue.category,
                    warehouses: warehousesID
                      
                })
                setPosts(responsePosts.allPosts)
                setIsLoading(false)
            }catch(error){
                console.log(error)
            }
            
        }

        fetchData()
        
    }, [page, filterValue])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const isEmpty = () => {
        console.log(posts)
        if(posts === null || posts.length === 0){
            console.log(false)
            return false
        }
        return true
    }

    return ( 
        <div>
            {
                !isLoading ? 
                <>
                    {
                        
                        !isEmpty() &&  
                        <img src='https://i.pinimg.com/564x/9a/7c/58/9a7c58b1532f43d69be0dcaec9130495.jpg' alt='img not found'
                            style={{width: '90%', height: '100%'}}/>
                    }

                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                        { posts !== null && 
                            posts.map((post: any, index: number) => (
                            <Grid xs={12} sm={4} md={4} key={index}>
                                <OrderCard order={post} isPost canDelete/>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Stack>
                            <Pagination count={Math.ceil(100 / LIMIT)} page={page} onChange={handleChange} />
                        </Stack>
                    </Box>
                </>   :
                <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            }
            
        </div>
        
     );
}

export default PostJustApproved;
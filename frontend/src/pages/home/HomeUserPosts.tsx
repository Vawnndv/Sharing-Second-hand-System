import React, { useEffect, useState } from 'react';
import Axios from '../../redux/APIs/Axios';
import { Box, Pagination, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import OrderCard from '../order/OrderCard';

function HomeUserPosts({filterValue, warehousesID}: any) {

    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<any>([])
    const LIMIT = 10

    useEffect(() => {
        const fetchData = async () => {
            const responseUser = await Axios.get('/user/get-user-address?userId=29');
            console.log(responseUser)
            
            const responsePosts: any = await Axios.post('/posts/user-post', {
                
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
            console.log(responsePosts)
            setPosts(responsePosts.allPosts)
        }

        fetchData()
        
    }, [page, filterValue])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
      };

    return ( 
        <>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            { posts !== null && 
                posts.map((post: any, index: number) => (
                <Grid xs={12} sm={4} md={4} key={index}>
                    <OrderCard order={post} isPost canApproval canDelete/>
                </Grid>
            ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Stack>
                <Pagination count={Math.ceil(100 / LIMIT)} page={page} onChange={handleChange} />
            </Stack>
        </Box>
        </>
        
     );
}

export default HomeUserPosts;
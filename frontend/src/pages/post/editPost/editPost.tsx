/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Axios from '../../../redux/APIs/Axios';
import Map from '../../../components/Map/map';
import Carousel from 'react-material-ui-carousel';
import { Button, Box, Container, Grid, Paper, TextField, Typography, ThemeProvider, createTheme, Modal, Stack, Input } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { format } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import DatePicker from '../../../components/DatePicker';
import './styles.scss'
import dayjs, { Dayjs } from 'dayjs';
import MapSelectAddress from '../../../components/Map/MapSelectAddress';
import LocationOnIcon from '@mui/icons-material/LocationOn';


function EditPost() {
    const locationHook = useLocation();
    const postState: any = locationHook.state || {}; // Phòng trường hợp state không tồn tại
    console.log(postState)

    const {postid}= useParams();
    const userLogin = useSelector((state: any) => state.userLogin);

    const navigate = useNavigate();

    const [post, setPost] = useState<any>(null); // Sử dụng Post | null để cho phép giá trị null
    const [postReceivers, setPostReceivers] = useState([]);
    const [profile, setProfile] = useState<any>();
    const [itemImages, setItemImages] = useState([]);

    const today = dayjs();
    const [date, setDate] = React.useState<[Dayjs, Dayjs]>([today, today]);

    const [location, setLocation] = useState<any>(null)
    // const [date, setDate] = React.useState<[Dayjs, Dayjs]>([dayjs((post.timestart).slice(0,10)), dayjs((post.timeEnd).slice(0,10))]);

    useEffect(() => {
        if(post != null){
            console.log('true')
            setDate([dayjs((post.timestart).slice(0,10)), dayjs((post.timeend).slice(0,10))])
            setLocation({
                address: post.address,
                latitude: parseFloat(post.latitude),
                longitude: parseFloat(post.longitude)
            })
        }
    }, [post])
    useEffect(() => {
        const fetchAllData = async () => {
          let itemIDs = null;
          let owner = null
          try {

            const res: any = await Axios.get(`/posts/${postid}`)

            if (!res) {
              throw new Error('Failed to fetch post details'); // Xử lý lỗi nếu request không thành công
            }
            setPost(res.postDetail); // Cập nhật state với dữ liệu nhận được từ API
            // console.log('Time Start',(res.postDetail.timestart).slice(0,10))
            

            itemIDs = res.postDetail.itemid;
            owner = res.postDetail.owner;
            
          } catch (error) {
            console.error('Error fetching post details:', error);
          }
    
          try {
    
            const res: any = await Axios.get(`/posts/postreceivers/${postid}`)
            if (!res) {
              throw new Error('Failed to fetch post receivers'); // Xử lý lỗi nếu request không thành công
            }
            setPostReceivers(res.postReceivers); // Cập nhật state với dữ liệu nhận được từ API
          } catch (error) {
            console.error('Error fetching post receivers:', error);
          }
    
          try {
    
            const res: any = await Axios.get(`/items/images/${itemIDs}`)
            if (!res) {
              throw new Error('Failed to fetch item details'); // Xử lý lỗi nếu request không thành công
            }
            setItemImages(res.itemImages); // Cập nhật state với dữ liệu nhận được từ API
          
          } catch (error) {
            console.error('Error fetching item details:', error);
          }
    
          try {
    
            const res = await Axios.get(`/user/get-profile?userId=${owner}`);
            console.log('getProfile', res);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            res && res.data && setProfile(res.data);
          } catch (error) {
            console.log(error);
          } 
        };
    
        if (postid) {
          fetchAllData();
        }
    
    }, [])

    console.log('post', post)
    console.log('profile', profile)
    console.log('itemImages', itemImages)
    
    const approvePost = async () => {
        if(post.givetype !== "Cho kho" && post.givetype !== "Cho kho (kho đến lấy)"){
            try{
                const res = await axios.post(`http://localhost:3000/posts/update-post-status`, {
                    postid: post.postid,
                    statusid: 12,
                })
                toast.success(`Post apporved`);      
                navigate(-1);
            } catch (error) {
                console.log(error);
            }
        }
        else if (post.givetype === 'Cho kho (kho đến lấy)') {

                try{
                    const res = await axios.post(`http://localhost:3000/posts/update-post-status`, {
                        postid: post.postid,
                        statusid: 7,
                    })
                    toast.success(`Post apporved`);            
                    navigate(-1);

                } catch (error) {
                    console.log(error);
                }
            }

            else{

                try{
                    const res = await axios.post(`http://localhost:3000/posts/update-post-status`, {
                        postid: post.postid,
                        statusid: 13,
                    })
                    toast.success(`Post apporved`);
                    navigate(-1);

                } catch (error) {
                    console.log(error);
                }
            }

    }
            

    const declinePost = async () => {
        try{
            const res = await axios.post(`http://localhost:3000/posts/update-post-status`, {
                postid: post.postid,
                statusid: 6,
            })
            toast.success('Post canceled successfully!');
            navigate(-1);

        } catch (error) {
            console.log(error);
        }

    }

    const handleClickEdit = () => {
        navigate(`/post/edit/${postid}`)
    }

    const handleClickPost = () => {
        console.log('post')
    }

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
        <div style={{display: 'flex', flexDirection: 'column',
            width: '100%', justifyContent:'center', alignItems: 'center'
        }}>
            <div style={{display: 'flex', flexDirection: 'column',
                width: '100%'
            }}>
                <Stack 
                    component="div"
                    flexDirection='row'
                    flexWrap='wrap'>
                    {
                        itemImages && 
                        itemImages.map((image: any, index: number) => {
                            return (
                                <Paper
                                    key={index}
                                    sx={{
                                        width: '400px',
                                        height: '250px',
                                        overflow: 'hidden',
                                        m: 2
                                    }}>
                                    <img
                                        style={{
                                            width: '400px',
                                            height: '250px',
                                        }}
                                        src={`${image.path}`} alt={`img ${index}`}/>
                                </Paper>
                                
                            )
                        })
                        
                    }
                
                    <Paper
                        className='paperImage'
                        elevation={1}
                        sx={{
                            width: '250px',
                            height: '250px',
                            overflow: 'hidden',
                            m: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            outline: '2px dash #000'
                        }}>
                            <AddPhotoAlternateOutlinedIcon className='iconImage' sx={{ color: '#A1A1A1'}}/>
                    </Paper>
                </Stack>
                
                {
                    post && 
                    <Stack>
                        <Typography
                            sx={{
                                mt: 2,
                                mx: 2,
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                            variant='h6'
                            >Tiêu đề</Typography>
                        <Input
                            value={post.title}
                            sx={{
                                mx: 2,
                                color: 'black'
                            }}/>

                        <Typography
                            sx={{
                                mt: 2,
                                mx: 2,
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                            variant='h6'
                            >Mô tả</Typography>
                        <Input
                            value={post.description}
                            sx={{
                                mx: 2,
                                color: 'black'
                            }}/>
                    </Stack>
                }

                {
                    
                    profile && post && location &&
                   
                        <Stack>

                            {/*  profile */}
                            <Stack
                            sx={{
                                mt: 2,
                                mx: 2,
                                color: 'black',
                                fontWeight: 'bold'
                            }}>
                                <Typography variant='h6' sx={{fontWeight: 'bold'}}>Thời gian cho đồ</Typography>
                                {/* <Typography variant='body2' component='div'>Từ ngày <Typography variant='body2' component='span'>{format(new Date(post.timestart), 'dd/MM/yyyy')} đến ngày {format(new Date(post.timeend), 'dd/MM/yyyy')}</Typography></Typography> */}
                                <DatePicker date={date} setDate={setDate}/>
                            </Stack>

                            <Stack
                            sx={{
                                mt: 2,
                                mx: 2,
                                color: 'black',
                                fontWeight: 'bold'
                            }}>
                                <Typography variant='h6' sx={{fontWeight: 'bold'}}>Địa điểm cho đồ</Typography>
                                {/* <Typography variant='body2' component='div'>{post.address}</Typography> */}
                                <Input
                                    value={post.address}
                                    sx={{
                                        color: 'black',
                                        mb: 2
                                    }}/>

                                <Grid item xs={12} sm={6} md={6} sx={{ mt: 1 }}>
                                    <Button fullWidth sx={{height: '55px', width: '100%', mb: 2}} variant="outlined" startIcon={<LocationOnIcon />}
                                        onClick={handleOpen}>
                                        Cập nhật vị trí cho
                                    </Button>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            {/* <MapSelectWarehouses warehouses={warehouses} warehousesSelected={warehousesSelected} handleSelectWarehouses={handleSelectWarehouses}/> */}
                                            <MapSelectAddress setLocation={setLocation} handleClose={handleClose} isUser/>
                                        </Box>
                                    </Modal>
                                </Grid>
                            </Stack>
                        </Stack>
                    
                }
                {
                    post && location &&
                    <Map lat={location.latitude} long={location.longitude} address={location.address}/>
                }


                <Stack
                    direction="row"
                    justifyContent='flex-end'
                    alignItems='center'
                    gap={2}
                    m={2}>
                    

                    {post && postState.canApproval&&
                        <Button
                            sx={{px: 4, py: 2, variant:'contained', backgroundColor: 'primary', boxShadow:'1px 1px 3px #A1A1A1', borderRadius: 5, gap: 1, cursor: 'ponter'}}
                            onClick={approvePost}>
                            <CheckCircleOutlineOutlinedIcon color='success'/>
                            <Typography variant='inherit' color='success'>Duyệt</Typography>
                        </Button>
                    }
                    
                    {post && postState.canDelete &&
                        <Button
                            sx={{px: 4, py: 2, variant:'contained', backgroundColor: 'success', boxShadow:'1px 1px 3px #A1A1A1', borderRadius: 5, gap: 1, cursor: 'ponter'}}
                            onClick={declinePost}>
                            <RemoveCircleIcon color='error'/>
                            <Typography variant='inherit' color='error'>Xóa</Typography>
                        </Button>
                    }

                    {post && postState.isWaitForPost &&
                        <Button
                            sx={{px: 4, py: 2, variant:'contained', backgroundColor: 'success', boxShadow:'1px 1px 3px #A1A1A1', borderRadius: 5, gap: 1, cursor: 'ponter'}}
                            onClick={handleClickEdit}>
                            <ModeEditOutlineIcon color='secondary'/>
                            <Typography variant='inherit' color='secondary'>Chỉnh sửa</Typography>
                        </Button>
                    }

                    {post && postState.isWaitForPost &&
                        <Button
                            sx={{px: 4, py: 2, variant:'contained', backgroundColor: 'success', boxShadow:'1px 1px 3px #A1A1A1', borderRadius: 5, gap: 1, cursor: 'ponter'}}
                            onClick={handleClickPost}>
                            <PostAddIcon color='success'/>
                            <Typography variant='inherit' color='success'>Đăng bài</Typography>
                        </Button>
                    }
                    
                </Stack>
            </div>
        </div>
     );
}

export default EditPost;
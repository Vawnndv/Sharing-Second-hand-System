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
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';


function EditPost() {
    const locationHook = useLocation();
    const postState: any = locationHook.state || {}; // Phòng trường hợp state không tồn tại
    console.log(postState)

    const {postid}= useParams();

    const navigate = useNavigate();

    const userLogin = useSelector((state: any) => state.userLogin);

    const [post, setPost] = useState<any>(null); // Sử dụng Post | null để cho phép giá trị null
    const [profile, setProfile] = useState<any>();
    const [userProfile, setUserProfile] = useState<any>();
    const [itemImages, setItemImages] = useState([]);
    const [itemNewImages, setItemNewImages] = useState([]);

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [phoneNumber, setPhoneNumber] = useState('')

    const today = dayjs();
    const [date, setDate] = React.useState<[Dayjs, Dayjs]>([today, today]);

    const [location, setLocation] = useState<any>(null)
    // const [date, setDate] = React.useState<[Dayjs, Dayjs]>([dayjs((post.timestart).slice(0,10)), dayjs((post.timeEnd).slice(0,10))]);
    const onChangeLocation = (e: any) => {
        const tempLocation: any = {...location}
        tempLocation.address = e.target.value
        setLocation(tempLocation)
    }

    useEffect(() => {
        if(post != null){
            console.log('true')
            setDate([dayjs((post.timestart).slice(0,10)), dayjs((post.timeend).slice(0,10))])
            setLocation({
                address: post.address,
                latitude: parseFloat(post.latitude),
                longitude: parseFloat(post.longitude)
            })
            setTitle(post.title)
            setDescription(post.description)
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
            setLocation({addressid: res.postDetail.adressid, address: res.postDetail.address, longitude: res.postDetail.longitude, latitude: res.postDetail.latitude});

            itemIDs = res.postDetail.itemid;
            owner = res.postDetail.owner;
            
          } catch (error) {
            console.error('Error fetching post details:', error);
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

          try {
    
            const res = await Axios.get(`/user/get-profile?userId=${userLogin.userInfo.id}`);
            console.log('getProfile', res);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            res && res.data && setUserProfile(res.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            res && res.data && setPhoneNumber(res.data.phonenumber);
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

    console.log("location", location)

    const handleRemoveImage = (type: string, index: number) => {
        console.log("handleRemoveImage")
        console.log('itemImages', itemImages)
        console.log('itemNewImages', itemNewImages)
        console.log(type, index)

        if(type === 'itemImages'){
            const tempItemImages = [...itemImages]
            tempItemImages.splice(index, 1);
            setItemImages(tempItemImages)
        }else{
            const tempItemNewImages = [...itemNewImages]
            tempItemNewImages.splice(index, 1);
            setItemNewImages(tempItemNewImages)
        }

    }

    const handleTakeImgFile = (e: any) => {
        const newFile: any = e.target.files[0]
        const newImages: any = [...itemNewImages]
        if (newFile) {
            const fileUrl = URL.createObjectURL(newFile);
            const newImage: any = newFile
            newImage.path = fileUrl
            console.log(newImage)
            newImages.push(newImage)
            setItemNewImages(newImages)
        }
    }

    const handleRepost = async () =>{

        const newTitle: any = title;
        const newDescription: any = description;
        let newPostid: any = null;

        console.log(location);
        let isSuccessRepost = true

        try{
            const res = await axios.post(`http://localhost:3000/posts/createPost`, {
                title: newTitle,
                location: location.address,
                description: newDescription,
                owner: userLogin.userInfo.id,
                time: new Date(post.time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
                itemid: post.itemid,
                timestart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`, // Tương tự cho timestart
                timeend: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`, // Và timeend
                isNewAddress: true,
                postLocation: location,
                isWarehousePost: true,
                givetypeid: 1,
                statusid: 12,
                warehouseid: post.warehouseid,
                phonenumber: phoneNumber
            });

            newPostid = res.data.postCreated.postid;
             
            
        }
        catch (error) {
            console.log(error);
            isSuccessRepost = false
        }

        try{
            const res = await axios.post(`http://localhost:3000/posts/update-post-status`, {
                postid: post.postid,
                statusid: 15,
            })
        } catch (error) {
            console.log(error);
            isSuccessRepost = false
        }

        if(isSuccessRepost){
            toast.success(`Đăng lại thành công`);     
            navigate(-1)
        }else{
            toast.success(`Lỗi đăng bài`);     
        }

        // try{
        //     const res = await axios.post(`http://localhost:3000/posts/update-post-status`, {
        //         postid: newPostid,
        //         statusid: 12,
        //         isApproveAction: true,
        //     })
        //     toast.success(`Update status sucessfully`);      
        //     navigate(-1);
        // } catch (error) {
        //     console.log(error);
        // }
    }
    
    
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
                        itemImages.length > 0 && 
                        itemImages.map((image: any, index: number) => {
                            return (
                                <Paper
                                    key={index}
                                    sx={{
                                        width: '300px',
                                        height: '250px',
                                        m: 2,
                                        position: 'relative'
                                    }}>
                                    <img
                                        style={{
                                            width: '300px',
                                            height: '250px',
                                            objectFit: 'cover'
                                        }}
                                        src={`${image.path}`} alt={`img ${index}`}/>
                                    <HighlightOffTwoToneIcon
                                        onClick={() => handleRemoveImage('itemImages', index)}
                                        sx={{ cursor: 'pointer', color: '#767676', fontSize: 35, position: 'absolute', top: 0, right: 0, transform: 'translate(40%, -40%)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            fontSize: 40
                                        }
                                     }} 
                                     />
                                    
                                </Paper>
                                
                            )
                        })
                        
                    }

                    {
                        itemNewImages.length > 0 && 
                        itemNewImages.map((image: any, index: number) => {
                            return (
                                <Paper
                                    key={index}
                                    sx={{
                                        width: '400px',
                                        height: '250px',
                                        m: 2,
                                        position: 'relative'
                                    }}>
                                    <img
                                        style={{
                                            width: '400px',
                                            height: '250px',
                                        }}
                                        src={`${image.path}`} alt={`img ${index}`}/>
                                    <HighlightOffTwoToneIcon 
                                        onClick={() => handleRemoveImage('itemNewImages', index)}
                                        sx={{ cursor: 'pointer', color: '#767676', fontSize: 35, position: 'absolute', top: 0, right: 0, transform: 'translate(40%, -40%)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            fontSize: 40
                                        }
                                     }} />
                                    
                                </Paper>
                                
                            )
                        })
                        
                    }
                
                <Paper
                    elevation={1}
                    sx={{
                        width: '250px',
                        height: '250px',
                        overflow: 'hidden',
                        m: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative', // Đảm bảo input phủ lên toàn bộ Paper
                        outline: '2px dashed #A1A1A1',
                    }}
                    className='paperImage'
                    >
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleTakeImgFile(e)}
                        style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        }}
                    />
                    <AddPhotoAlternateOutlinedIcon className='iconImage' sx={{ color: '#A1A1A1' }} />
                </Paper>
                </Stack>
                
                {
                    post && phoneNumber &&
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                            >Số điện thoại</Typography>
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            sx={{
                                mx: 2,
                                color: 'black'
                            }}/>
                    </Stack>
                }

                {
                    
                    profile && userProfile && post && location &&
                   
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
                                    value={location.address}    
                                    onChange={(e) => onChangeLocation(e)}
                                    sx={{
                                        color: 'black',
                                        mb: 2
                                    }}/>

                                <Grid item xs={12} sm={6} md={6} sx={{ mt: 1 }}>
                                    <Button fullWidth sx={{height: '55px', width: '100%', mb: 2}} variant="outlined" startIcon={<LocationOnIcon />}
                                        onClick={handleOpen}>
                                        Cập nhật vị trí cho đồ
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
                    

                    {post &&
                        <Button
                            sx={{px: 4, py: 2, variant:'contained', backgroundColor: 'success', boxShadow:'1px 1px 3px #A1A1A1', borderRadius: 5, gap: 1, cursor: 'ponter'}}
                            onClick={handleRepost}>
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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Axios from '../../../redux/APIs/Axios';
import Map from '../../../components/Map/map';
import Carousel from 'react-material-ui-carousel';
import { Avatar, Box, Button, Card, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { format } from 'date-fns';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function ShowImages({ images }: any) {
    
    return (
        <Carousel
              animation="slide"
              swipe
              autoPlay={false}
              navButtonsAlwaysVisible
              indicators
              cycleNavigation
              navButtonsProps={{
                style: {
                  background: 'transparent',
                  color: 'black',
                  borderRadius: 0,
                  margin: 0,
                  position: 'relative'
                },
              }}
          >
            {images.map((image: any, index: any) => (
            <Paper key={index} sx={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={image.path}
                alt=""
                style={{ objectFit: 'cover', width: '100%', height: '90vh'}}
              />
            </Paper>
            ))}
            
        </Carousel>
    )
}

function ViewPostDetail() {
    const location = useLocation();
    const postState: any = location.state || {}; // Phòng trường hợp state không tồn tại
    console.log(postState)

    const {postid}= useParams();
    const userLogin = useSelector((state: any) => state.userLogin);

    const navigate = useNavigate();

    const [post, setPost] = useState<any>(null); // Sử dụng Post | null để cho phép giá trị null
    const [postReceivers, setPostReceivers] = useState([]);
    const [profile, setProfile] = useState<any>();
    const [itemImages, setItemImages] = useState([]);

    const [warehouseInfo, setWarehouseInfo] = useState<any>(null);

    const [isLoading, setIsLoading] = useState(false)

    // const [isUserPost, setIsUserPost] = useState(false);
    // const [itemID, setItemID] = useState();
    useEffect(() => {
        const fetchAllData = async () => {
          setIsLoading(true)
          let itemIDs = null;
          let owner = null;
          let warehouseid: any = null;
          try {
            // console.log(postID);
            // setIsLoading(true);
            const res: any = await Axios.get(`/posts/${postid}`)
            // const res = await postsAPI.HandlePost(
            //   `/${postID}`,
            // );
            if (!res) {
              throw new Error('Failed to fetch post details'); // Xử lý lỗi nếu request không thành công
            }
            setPost(res.postDetail); // Cập nhật state với dữ liệu nhận được từ API
            console.log(res.postDetail);
            // setItemID(res.postDetail.itemid);
            itemIDs = res.postDetail.itemid;
            owner = res.postDetail.owner;
            warehouseid = res.postDetail.warehouseid;
            // console.log(post?.title +  ' ' + res.data.postDetail.latitude);
            // setIsUserPost(res.postDetail.owner === '37');
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
            // const res = await itemsAPI.HandleAuthentication(
            //   `/${itemID}`,
            // );
            if (!res) {
              throw new Error('Failed to fetch item details'); // Xử lý lỗi nếu request không thành công
            }
            setItemImages(res.itemImages); // Cập nhật state với dữ liệu nhận được từ API
            // setShowRightArrow(res.data.itemImages > 1 ? true : false)
            // setItemID(data.id);
          
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
            const res: any = await Axios.get(`/warehouse/getWarehouse/${warehouseid}`);
            console.log(res);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            setWarehouseInfo(res.wareHouse);
          } catch (error) {
            console.log(error);
          } 

          setIsLoading(false)
        };
    
        if (postid) {
          fetchAllData();
        }
    
    }, [])

    console.log('post', post);
    // console.log('postReceivers', postReceivers)
    // console.log('profile', profile)
    // console.log('itemImages', itemImages)
    // console.log('isUserPost', isUserPost)
    // console.log('itemID', itemID)

    
    const approvePost = async () => {
        console.log(post);
        setIsLoading(true)

        if(post.givetypeid === 1){

            try{
                const res = await Axios.post(`/posts/update-post-status`, {
                    postid: post.postid,
                    statusid: 12,
                    isApproveAction: true
                })
                toast.success(`Duyệt bài thành công`);      
            } catch (error) {
                console.log(error);
            }
        }
        else if (post.givetypeid === 4) {
            try{
                const res = await Axios.post(`/posts/update-post-status`, {
                    postid: post.postid,
                    statusid: 12,
                    isApproveAction: true
                })
                toast.success(`Duyệt bài thành công`);            
            } catch (error) {
                console.log(error);
            }
            let orderID: any = null;
            const time = new Date();
            const response: any = await Axios.post(`/order/createOrder`, {
                title: post.title,
                location: '',
                description: post.description,
                departure: '',
                time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
                itemid: post.itemid,
                status: 'Chờ cộng tác viên lấy hàng',
                statusid: 7,
                qrcode: '',
                ordercode: '',
                usergiveid: post.owner,
                userreceiveid: userLogin.userInfo.id,
                postid: post.postid,
                imgconfirm: '',
                locationgive: post.addressid,
                locationreceive: warehouseInfo.addressid,
                givetypeid: post.givetypeid,
                imgconfirmreceive: '',
                givetype: post.give_receivetype,
                warehouseid: post.warehouseid,
            }); 
            // console.log("RESPONSE.DATAAAAAAAAAAAAAAAAAAAAAAAAAAAA",response)
            orderID = response.orderCreated.orderid;
            
            try{
                const currentstatus = 'Chờ cộng tác viên lấy hàng';
                const responseTrace = await Axios.post(`/order/createTrace`, {
                    currentstatus,
                    orderid: orderID,
                });
                toast.success(`Tạo đơn hàng thành công`);

            } catch(error){
                console.log(error);
            }

            try{
                const responseInputcard = await Axios.post(`/card/createInputCard`, {
                    itemid: post.itemid,
                    qrcode: '',
                    usergiveid: post.owner,
                    warehouseid: post.warehouseid,          // NHỚ FIX CÁI NÀY AAAAAAAAAAAAAAAAAAAAAAAAAAAAA TODO
                    orderid: orderID
                });
                toast.success(`Tạo phiếu nhập thành công`);
            }
            catch (error) {
                console.log(error);
            // }
            }


        }

        else{
            try{
                const res = await Axios.post(`/posts/update-post-status`, {
                    postid: post.postid,
                    statusid: 12,
                    isApproveAction: true
                })
                toast.success(`Duyệt bài thành công`);


            } catch (error) {
                console.log(error);
            }
            let orderID: any = null;
            const time = new Date();
            const response: any = await Axios.post(`/order/createOrder`, {
                title: post.title,
                location: '',
                description: post.description,
                departure: '',
                time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
                itemid: post.itemid,
                status: 'Chờ người cho giao hàng',
                statusid: 13,
                qrcode: '',
                ordercode: '',
                usergiveid: post.owner,
                userreceiveid: userLogin.userInfo.id,
                postid: post.postid,
                imgconfirm: '',
                locationgive: post.addressid,
                locationreceive: warehouseInfo.addressid,
                givetypeid: post.givetypeid,
                imgconfirmreceive: '',
                givetype: post.give_receivetype,
                warehouseid: post.warehouseid,
            }); 
            orderID = response.orderCreated.orderid;

            try{
                const responseInputcard = await Axios.post(`/card/createInputCard`, {
                    itemid: post.itemid,
                    qrcode: '',
                    usergiveid: post.owner,
                    warehouseid: post.warehouseid,
                    orderid: orderID
                }); 
                toast.success(`Tạo phiếu nhập thành công`);
            }
            catch (error) {
                console.log(error);
            }

        }
        
        navigate(-1);
        setIsLoading(false)
    }
            

    const declinePost = async () => {
        try{
            const res = await Axios.post(`/posts/update-post-status`, {
                postid: post.postid,
                statusid: 6,
                isApproveAction: true
            })
            toast.success('Hủy bài đăng thành công!');
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

    const handleNavigateToUserProfile = (userID: string, event: any) => {
        event.stopPropagation();
        navigate(`/profile?profileID=${userID}`)
    }
    
    // console.log(evenlySpacedDates);
    return ( 
        <div style={{display: 'flex', flexDirection: 'column',
            width: '100%', justifyContent:'center', alignItems: 'center'
        }}>
            {
                !isLoading ? 
                <div style={{display: 'flex', flexDirection: 'column',
                    width: '100%'
                }}>
                    {
                        itemImages && 
                        <ShowImages images={itemImages}/>
                    }
                    {postReceivers && post && post.statusname !== 'Chờ xét duyệt' &&
                        <Stack
                            flexDirection='row'
                            justifyContent='flex-end'
                            alignItems='center'
                            gap={2}
                            p={2}
                            sx={{backgroundColor: '#F5F5F5'}}>
                                <Stack
                                    flexDirection='row'
                                    justifyContent='flex-end'
                                    alignItems='center'
                                    gap={1}>
                                        <VolunteerActivismIcon sx={{width: 40, height: 40}} color='success'/>
                                        <Typography variant='body2'>Người nhận: {postReceivers.length}</Typography>
                                </Stack>
            
                                <Stack
                                    flexDirection='row'
                                    justifyContent='flex-end'
                                    alignItems='center'
                                    gap={1}>
                                        <FavoriteIcon sx={{width: 40, height: 40}} color='error'/>
                                        <Typography variant='body2'>Thích: 0</Typography>
                                </Stack>
                        </Stack>
                    }
                    {
                        post &&
                        <Stack
                            flexDirection='row'
                            justifyContent='flex-end'
                            m={2}>
                                <Typography variant='body2' component='div' color='error'>Ngày hết hạn <Typography variant='body2' component='span'>{format(new Date(post.timeend), 'dd/MM/yyyy')}</Typography></Typography>
                        </Stack>
                    }
                    {
                        
                        profile && post && 
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10, marginBottom: 30}}>
                            <Stack
                                flexDirection='column'
                                justifyContent='flex-start'
                                gap={3}
                                style={{width: '95%'}}>
    
                                {/*  profile */}
                                <Stack
                                    flexDirection='row'
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    gap={3}
                                    style={{width: '100%'}}>
                                        <Avatar sx={{width: 80, height: 80, cursor: 'pointer'}} 
                                            component='div'
                                            onClick={(event: any) => handleNavigateToUserProfile(post.owner, event)}
                                            src={`${profile.avatar !== "" ? profile.avatar : 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'}`}/>
                                        <Stack
                                            flexDirection='column'
                                            justifyContent='center'
                                            alignItems='flex-start'
                                            gap={0.5}>
                                                <Typography variant='body2' component='div'
                                                    onClick={(event: any) => handleNavigateToUserProfile(post.owner, event)}>
                                                    <Typography variant='body2' sx={{fontWeight: 'bold', cursor: 'pointer'}} component='span'>{profile.firstname} {profile.lastname} </Typography> đang muốn cho đồ
                                                </Typography>
                                                <Typography variant='h6' sx={{fontWeight: 'bold'}}>{post.title}</Typography>
                                                <Stack 
                                                    flexDirection='row'
                                                    justifyContent='center'
                                                    alignItems='center'
                                                    gap={0.5}>
                                                    <AccessTimeIcon sx={{width: 30, height: 30}}/> <Typography variant='body2'> {format(new Date(post.createdat), 'dd/MM/yyyy HH:mm:ss')}</Typography>
                                                </Stack>
                                                
                                        </Stack>
                                </Stack>
    
                                <Typography variant='body2'>{post.description}</Typography>
    
                                <Stack>
                                    <Typography variant='h6' sx={{fontWeight: 'bold'}}>Phương thức đăng bài</Typography>
                                    <Typography variant='body2' component='div'>{post.give_receivetype}</Typography>
                                </Stack>
    
                                <Stack>
                                    <Typography variant='h6' sx={{fontWeight: 'bold'}}>Trạng thái</Typography>
                                    <Typography variant='body2' component='div'>{post.statusname}</Typography>
                                </Stack>
    
                                <Stack>
                                    <Typography variant='h6' sx={{fontWeight: 'bold'}}>Thời gian cho đồ</Typography>
                                    <Typography variant='body2' component='div'>Từ ngày <Typography variant='body2' component='span'>{format(new Date(post.timestart), 'dd/MM/yyyy')} đến ngày {format(new Date(post.timeend), 'dd/MM/yyyy')}</Typography></Typography>
                                </Stack>
    
                                <Stack>
                                    <Typography variant='h6' sx={{fontWeight: 'bold'}}>Địa điểm cho đồ</Typography>
                                    <Typography variant='body2' component='div'>{post.address}</Typography>
                                </Stack>
                            </Stack>
    
                        </div>
                        
                    }
                    {
                        post && 
                        <Map lat={parseFloat(post.latitude)} long={parseFloat(post.longitude)} address={post.address}/>
                    }
                    {
                        post && post.statusname !== 'Chờ xét duyệt' && 
                        <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 10, marginBottom: 30}}>
                            <Typography variant='h6' sx={{fontWeigth: 'bold', width: '95%', mb: 2, mt: 2}}>Danh sách người xin</Typography>
                            <Stack
                                flexDirection='column'
                                justifyContent='flex-start'
                                gap={3}
                                style={{width: '95%'}}>
    
                                {/*  profile */}
                                <Grid
                                    container
                                    >
                                    {
                                        postReceivers.map((receiver: any, index: number) => {
                                            return (
                                                <Grid xs={12} md={6} lg={4} >
                                                    <Card sx={{p: 2, m: 1}}>
                                                        <Stack
                                                            flexDirection='row'
                                                            justifyContent='flex-start'
                                                            alignItems='center'
                                                            gap={3}
                                                            key={index}>
                                                                <Avatar sx={{width: 70, height: 70, cursor: 'pointer'}} 
                                                                    component='div'
                                                                    onClick={(event: any) => handleNavigateToUserProfile(receiver.receiverid, event)}
                                                                    src={`${receiver.avatar !== "" ? receiver.avatar : 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'}`}/>
                                                                <Stack
                                                                    flexDirection='column'
                                                                    justifyContent='center'
                                                                    alignItems='flex-start'
                                                                    gap={0.5}
                                                                    >
                                                                        <Typography variant='body2' component='div'
                                                                            onClick={(event: any) => handleNavigateToUserProfile(receiver.receiverid, event)}>
                                                                            <Typography variant='body2' sx={{fontWeight: 'bold', cursor: 'pointer'}} component='span'>{receiver.firstname} {receiver.lastname} </Typography>
                                                                        </Typography>
                                                                        <Typography variant='body2' sx={{fontWeight: 'bold'}} color='green'>{receiver.give_receivetype}</Typography>
                                                                        <Stack 
                                                                            flexDirection='row'
                                                                            justifyContent='center'
                                                                            alignItems='center'
                                                                            gap={0.5}>
                                                                            <AccessTimeIcon sx={{width: 30, height: 30}}/> <Typography variant='body2'> {format(new Date(receiver.time), 'dd/MM/yyyy HH:mm:ss')}</Typography>
                                                                        </Stack>
                                                                        
                                                                </Stack>
                                                        </Stack>
                                                    </Card>
                                                    
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Stack>
    
                        </div>
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
    
                        {/* {post && postState.isWaitForPost &&
                            <Button
                                sx={{px: 4, py: 2, variant:'contained', backgroundColor: 'success', boxShadow:'1px 1px 3px #A1A1A1', borderRadius: 5, gap: 1, cursor: 'ponter'}}
                                onClick={handleClickPost}>
                                <PostAddIcon color='success'/>
                                <Typography variant='inherit' color='success'>Đăng bài</Typography>
                            </Button>
                        } */}
                        
                    </Stack>
                </div>

                :

                <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            }
            
        </div>
     );
}

export default ViewPostDetail;
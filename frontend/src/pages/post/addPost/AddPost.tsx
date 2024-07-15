import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Modal, Stack, TextField, CircularProgress, Paper } from '@mui/material';
import MapSelectAddress from '../../../components/Map/MapSelectAddress';
import Map from '../../../components/Map/map';
import DatePicker from '../../../components/DatePicker';
import './styles.scss'
import dayjs, { Dayjs } from 'dayjs';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CachedIcon from '@mui/icons-material/Cached';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import getGPTDescription from '../../../redux/APIs/apiChatGPT';
import Axios from '../../../redux/APIs/Axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SelectComponent from '../../../components/SelectComponent';
import toast from 'react-hot-toast'

const steps = ['Thông tin sản phẩm', 'Thông tin bài đăng'];

export default function AddPost() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [itemImages, setItemImages] = useState<any>([]);
  const [itemNewImages, setItemNewImages] = useState<any>([]);

  const [warehouseInfo, setWarehouseInfo] = useState<any>(null)

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('')

  const [phoneNumber, setPhoneNumber] = useState('')

  const today = dayjs();
  const nextWeek = dayjs().add(1, 'week')
  const [date, setDate] = useState<[Dayjs, Dayjs]>([today, nextWeek]);
  const [isLoading, setIsLoading] = useState(false);

  const [location, setLocation] = useState<any>(null);
  const userLogin = useSelector((state: any) => state.userLogin);

  const [itemName, setItemName] = useState('')
  const [amount, setAmount] = useState('')

  const [itemTypes, setItemTypes] = useState<any>([])
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [itemCategory, setItemCategory] = useState(1)

  useEffect(() => {
    const fetchWareHouse = async () => {
        setIsLoading(true)
        try {
            
            const response: any = await Axios.get(`/warehouse/getWarehouseByUserID/${userLogin.userInfo.id}`)
            setLocation({
                addressid: response.wareHouse.addressid,
                address: response.wareHouse.address,
                latitude: parseFloat(response.wareHouse.latitude),
                longitude: parseFloat(response.wareHouse.longitude)
            })
            
            
            setWarehouseInfo(response.wareHouse)
            setPhoneNumber(response.wareHouse.phonenumber)
        } catch (error) {
            console.log(error)
        }

        try {
            const res: any = await Axios.get(`/items/types`)
            // const res = await postsAPI.HandlePost(
            //   `/${postID}`, 
            // );
            if (!res) {
              throw new Error('Failed to fetch item types'); // Xử lý lỗi nếu request không thành công
            }
    
            setItemTypes(res.itemTypes); // Cập nhật state với dữ liệu nhận được từ API
          } catch (error) {
            console.error('Error fetching item types:', error);
        }
        setIsLoading(false)
    }

    fetchWareHouse()

  }, [])

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };


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


    const handleRemoveImage = (type: string, index: number) => {
        if(itemImages.length + itemNewImages.length === 1){
            return;
        }

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

    const UploadImageToAws3 = async (file: any, isLimit: boolean) => {
        setIsLoading(true)
        try {
          // Đọc nội dung của tệp tin bằng FileReader
          const fileReader: any = new FileReader();
          fileReader.readAsDataURL(file);
    
          return await new Promise((resolve, reject) => {
              fileReader.onload = async () => {
                  try {
                      // Chuyển đổi nội dung của tệp thành dạng Base64
                      const fileContent = fileReader.result.split(',')[1];
    
                      // Tạo FormData và thêm tệp tin và thông tin vào đó
                      const formData = new FormData();
                      formData.append('file', fileContent);
                      formData.append('name', `${new Date().getTime()}${file.name}`);
                      formData.append('type', file.type);
                      if(isLimit){
                        formData.append('typeExpire', "expire")
                      }
    
                      // Gửi FormData qua phương thức POST
                      const serverResponse = await Axios.post('/aws3/uploadImage', formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      });
    
                      // Xử lý phản hồi từ server nếu cần
                      const data: any = serverResponse;
                      resolve(data);
                  } catch (error) {
                      console.error('Error uploading file:', error);
                      reject(error);
                  }
              };
              setIsLoading(false)
          });
        } catch (error) {
            console.error('Error reading file:', error);
            setIsLoading(false)
            return null;
        }
        
      };

    const handleTakeImgFile = async (e: any) => {
        const newFile: any = e.target.files[0]
        const newImages: any = [...itemNewImages]
        if (newFile) {
            const fileUri = URL.createObjectURL(newFile);
            try {
                const uploadAWS: any = await UploadImageToAws3(newFile, true)
                const newImage: any = newFile
                newImage.path = uploadAWS.url
                newImage.uri= fileUri
                newImages.push(newImage)
                setItemNewImages(newImages)
            } catch (error) {
                console.log(error)
            }
            
            
        }
    }

    const handleRenderDescriptionGPT = async () => {
        setIsLoading(true)
        const imageUrls = []
        for(let i = 0; i < itemImages.length; i += 1 ){
            imageUrls.push(itemImages[i].path)
        }

        for(let i = 0; i < itemNewImages.length; i += 1 ){
            imageUrls.push(itemNewImages[i].path)
        }

        const generateDesciption = await getGPTDescription(title, imageUrls)
        setDescription(generateDesciption)
        setIsLoading(false)
    }

    const onChangeLocation = (e: any) => {
        const tempLocation: any = {...warehouseInfo}
        tempLocation.address = e.target.value
        setLocation(tempLocation)
    }

    const handleOnChangeAmount = (event: any) => {
        if (/^\d*$/.test(event.target.value)) {
            setAmount(event.target.value)
        }
        
    }
    
  const handleNext = async () => {
    setIsLoading(true)

    if(activeStep === steps.length - 1){
        // Hoàn thành, thực hiện đăng bài
        try{
            // const resGetItemDetail: any = await Axios.get(`/items/${post.itemid}`)
            const resCreateItem: any = await Axios.post(`/items`, {
                name: itemName,
                quantity: amount,
                itemtypeID: itemCategory,
            });

            await Axios.post(`/posts/createPost`, {
                title,
                location: location.address,
                description,
                owner: userLogin.userInfo.id,
                time: new Date().toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
                itemid: resCreateItem.item.itemid,
                timestart: `${date[0].year()}-${date[0].month() + 1}-${date[0].date()}`, // Tương tự cho timestart
                timeend: `${date[1].year()}-${date[1].month() + 1}-${date[1].date()}`, // Và timeend
                isNewAddress: false,
                postLocation: location,
                isWarehousePost: true,
                givetypeid: 1,
                statusid: 12,
                warehouseid: warehouseInfo.warehouseid,
                phonenumber: phoneNumber
            });

            itemNewImages.map(async (image: any) => {
                const data: any = await UploadImageToAws3(image, false);
                await Axios.post(`/items/upload-image`,{
                  path: data.url,
                  itemID: resCreateItem.item.itemid
                })
      
            })
            

            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
            toast.success('Đăng bài thành công!')
        }
        catch (error) {
            console.log(error);
            // isSuccessRepost = false
            toast.error(`Đăng bài thất bại! ${error}`)
        }
    }else {
        // Next qua bước tiếp theo
        // eslint-disable-next-line no-lonely-if
        if( itemNewImages.length > 0 && itemName !== '' && amount !== '') {
            let newSkipped = skipped;
            if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }else{
            toast.error('Bạn phải điền đầy đủ thông tin trước khi qua bước mới')
        }
    }

    setIsLoading(false)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setTitle('');
    setPhoneNumber('')
    setAmount('')
    setDescription('')
    setItemCategory(1)
    setItemName('')
    setDate([today,nextWeek])
    setItemNewImages([])
  };

  return (
    <div style={{
        width: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}>
        {
            !isLoading ?
            <Box sx={{ width: '90%', mt: 5 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    return (
                        <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>
                            {label}
                        </StepLabel>
                        </Step>
                    );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <>
                    <Stack sx={{
                        width: '100%',
                        height: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <img 
                            style={{
                                width: '30vw'
                            }}
                            src='https://i.pinimg.com/564x/16/91/46/1691462ee976cd17c631bdc5cad93af3.jpg' alt='thank-you'/>
                    </Stack>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                    </>
                ) : (
                    <>
                    {
                        activeStep === 0 ?
                        
                            
                        <div style={{display: 'flex', flexDirection: 'column',
                            width: '100%', justifyContent:'center', alignItems: 'center'
                        }}>
                            {
                                !isLoading ?
                                <div style={{display: 'flex', flexDirection: 'column',
                                    width: '100%'
                                    }}>
                                    <Stack 
                                        component="div"
                                        flexDirection='row'
                                        flexWrap='wrap'
                                        >
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
                                                            sx={{ cursor: 'pointer', color: 'rgb(0,0,0,0.3)', fontSize: 35, position: 'absolute', top: 0, right: 0, transform: 'translate(40%, -40%)',
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
                                                            src={`${image.uri}`} alt={`img ${index}`}/>
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
                                        itemNewImages.length < 1 &&
                                        <Typography variant='body1' color='error' sx={{
                                            fontSize: 13,
                                            marginLeft: 4
                                        }}>Phải có ít nhất một ảnh</Typography>
                                    }
                                    
                                    
                                    <Stack>
                                            <Typography
                                                sx={{
                                                    mt: 2,
                                                    mx: 2,
                                                    color: 'black',
                                                    fontWeight: 'bold'
                                                }}
                                                variant='h6'
                                                >Tên món đồ</Typography>
                                            <TextField
                                                error={itemName === ""}
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                                sx={{
                                                    mx: 2,
                                                    color: 'black'
                                                }}
                                                helperText={itemName === "" ? "Tên món đồ không được để trống" : ''}/>
                
                                            <Stack
                                                flexDirection='row'
                                                alignItems='center'
                                                mt={1}>
                                                <Typography
                                                    sx={{
                                                        mt: 2,
                                                        mx: 2,
                                                        color: 'black',
                                                        fontWeight: 'bold'
                                                    }}
                                                    variant='h6'
                                                    >Số lượng</Typography>
                
                                            </Stack>
                                            
                                            <TextField
                                                error={(amount === "" || parseInt(amount, 10) > 50)}
                                                value={amount}
                                                onChange={(e) => handleOnChangeAmount(e)}
                                                sx={{
                                                    mx: 2,
                                                    color: 'black'
                                                }}
                                                type="number"
                                                inputProps={{ min: 0, max: 100, step: 1 }}
                                                helperText={(amount === "" || parseInt(amount, 10) > 50) ? "Số lượng không được trống và phải <= 50" : ''}
                                                multiline/>
                
                                            
                                        </Stack>
                
                                    {
                                        itemTypes &&
                                            <Stack>
                
                                                {/*  profile */}
                                                                
                                                <Stack
                                                sx={{
                                                    mt: 2,
                                                    mx: 2,
                                                    color: 'black',
                                                    fontWeight: 'bold',
                                                    flex: 1
                                                }}>
                                                    <Typography variant='h6' sx={{fontWeight: 'bold'}}>Loại món đồ</Typography>
                                                    <SelectComponent itemTypesArray={itemTypes} setItemCategory={setItemCategory}/>
                                                </Stack>
                                            </Stack>
                                        
                                    }
                                    
                                </div> 
                                :
                                <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                                    <CircularProgress />
                                </Box>
                            } 
                            
                        </div>: 
                        <div style={{display: 'flex', flexDirection: 'column',
                            width: '100%', justifyContent:'center', alignItems: 'center'
                        }}>
                            {
                                !isLoading ?
                                <div style={{display: 'flex', flexDirection: 'column',
                                    width: '100%'
                                    }}>
                                    
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
                                            <TextField
                                                error={title === ""}
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                sx={{
                                                    mx: 2,
                                                    color: 'black'
                                                }}
                                                helperText={title === "" ? "Tiêu đề không được để trống" : ''}/>
                
                                            <Stack
                                                flexDirection='row'
                                                alignItems='center'
                                                mt={1}>
                                                <Typography
                                                    sx={{
                                                        mt: 2,
                                                        mx: 2,
                                                        color: 'black',
                                                        fontWeight: 'bold'
                                                    }}
                                                    variant='h6'
                                                    >Mô tả</Typography>
                
                                                <Button variant='contained'
                                                    color='success'
                                                    startIcon={<CachedIcon />}
                                                    onClick={() => handleRenderDescriptionGPT()}
                                                    sx={{}}>Tạo mô tả tự động</Button>
                                            </Stack>
                                            
                                            <TextField
                                                error={description === ""}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                sx={{
                                                    mx: 2,
                                                    color: 'black'
                                                }}
                                                helperText={description === "" ? "Mô tả không được để trống" : ''}
                                                multiline/>
                
                                            
                                            
                
                                            <Typography
                                                sx={{
                                                    mt: 2,
                                                    mx: 2,
                                                    color: 'black',
                                                    fontWeight: 'bold'
                                                }}
                                                variant='h6'
                                                >Số điện thoại</Typography>
                                            <TextField
                                                error={(phoneNumber.length < 10 || phoneNumber.length > 11)}
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                sx={{
                                                    mx: 2,
                                                    color: 'black'
                                                }}
                                                helperText={ ( phoneNumber.length < 10 || phoneNumber.length > 11 ) ? 'Sai định dạng số điện thoại' : ''}/>
                                        </Stack>
                
                                    {
                                        
                                        
                                        location &&
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
                                                    <TextField
                                                        disabled
                                                        error={location.address === ""}
                                                        value={location.address}    
                                                        onChange={(e) => onChangeLocation(e)}
                                                        sx={{
                                                            color: 'black',
                                                            mb: 2
                                                        }}
                                                        helperText={location.address === "" ? "Địa chỉ không được để trống" : ''}/>
                
                                                    <Grid item xs={12} sm={6} md={6} sx={{ mt: 1 }}>
                                                        <Button fullWidth sx={{height: '55px', width: '100%', mb: 2}} variant="outlined" startIcon={<LocationOnIcon />}
                                                            onClick={handleOpen}
                                                            disabled>
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
                                        location &&
                                        <Map lat={location.latitude} long={location.longitude} address={location.address}/>
                                    }
                
                                </div> 
                                :
                                <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                                    <CircularProgress />
                                </Box>
                            } 
                            
                        </div>
                        
                    }
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 2 }}>
                        <Button
                        variant='outlined'
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1, p: 2 }}
                        >
                        Trở về
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        
                        <Button variant='outlined'
                        onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                        </Button>
                    </Box>
                    </>
                )}
            </Box>
            :
            <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                <CircularProgress />
            </Box>
        }
        
    </div>
    
  );
}
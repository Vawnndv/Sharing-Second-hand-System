import { Avatar, Box, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import moment from 'moment';
import 'moment/locale/vi';
import Carousel from 'react-material-ui-carousel';
import { getOrderDetail, getImagesItem, getTrackingOrder } from '../../../redux/services/orderServices';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { formatDateTime } from '../../../utils/FormatDateTime';

function ViewDetailOrder() {
  moment.locale();
  const { orderid } = useParams();
  const orderID: any = orderid
  const [order, setOrder] = useState<any>();
  const [isLoading, setIsLoading] = useState(false)
  const [itemImages, setItemImages] = useState<any>([]);
  // const [activeStep, setActiveStep] = React.useState(0);
  const [data, setData] = useState<any>([]);
  const location = useLocation()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await getOrderDetail(orderID);
      setOrder(result.data);
      if (result.data.itemid)  {
        
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const result_image = await getImagesItem(result.data.itemid)
        if (!result_image) {
          throw new Error('Failed to fetch item details'); // Xử lý lỗi nếu request không thành công
        }
        setItemImages(result_image.itemImages); // Cập nhật state với dữ liệu nhận được từ API
      }
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const result_tracking = await getTrackingOrder(orderID);
      setData(result_tracking.data)
      // setActiveStep(data.length)

      setIsLoading(false)
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname]);
  
  return (
    <Box sx={{flex: 1, mx: 5, my: 5}}>
      {
        isLoading ? (
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Avatar alt="Avatar" src={order?.avatar} />
              <Box sx={{ ml: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography fontWeight="bold" variant="body1" color="initial">{order?.username ? order?.username : `${order?.firstname} ${order?.lastname}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <AccessTimeOutlinedIcon fontSize="small" />
                  <Typography ml={1} variant="body2" color="initial" fontStyle='italic'>{moment(order?.createdat).fromNow()}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Typography gutterBottom variant="body1" fontWeight='bold'>Trạng thái </Typography>
              <Typography ml={1} gutterBottom variant="body1" fontWeight='bold' color="customColor.status"> {order?.status} </Typography>
            </Box>
            {
              order?.userreceiveid &&
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Typography gutterBottom variant="body1" fontWeight='bold'>Người nhận: </Typography>
                  <Typography ml={1} gutterBottom variant="body1" fontWeight='bold'>
                    {order?.usernamereceive ? order?.usernamereceive : `${order?.firstnamereceive} ${order?.lastnamereceive}`}
                  </Typography>
                </Box>
                {
                  order.phonenumberreceive &&
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography gutterBottom variant="body1" fontWeight='bold'>Số điện thoại: </Typography>
                    <Typography ml={1} gutterBottom variant="body1" fontWeight='bold'>
                      {order?.phonenumberreceive}
                    </Typography>
                  </Box>
                }
                {
                  order.timestart && order.timeend &&
                  <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Typography gutterBottom variant="body1" fontWeight='bold'>Ngày bắt đầu nhận: </Typography>
                      <Typography ml={1} gutterBottom variant="body1" fontWeight='bold' color="red">
                        {formatDateTime(order?.timestart)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Typography gutterBottom variant="body1" fontWeight='bold'>Ngày kết thúc: </Typography>
                      <Typography ml={1} gutterBottom variant="body1" fontWeight='bold' color="red">
                        {formatDateTime(order?.timeend)}
                      </Typography>
                    </Box>
                  </Box>
                }
                {
                  order.imgconfirmreceive && order.imgconfirmreceive !== ' ' &&
                  <Box sx={{mb: 2}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <Typography gutterBottom variant="body1" fontWeight='bold'>Ngày nhận: </Typography>
                      <Typography ml={1} gutterBottom variant="body1" fontWeight='bold' color='primary.main'>
                        {formatDateTime(data[data.length - 1].createdat)}
                      </Typography>
                    </Box>
                    <Typography gutterBottom variant="body1" fontWeight='bold' fontStyle='italic' color='red'>Ảnh xác nhận </Typography>
                    <Paper sx={{ height: 200, width: 200 }}>
                      <img
                        src={order.imgconfirmreceive}
                        alt=""
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </Paper>
                  </Box>
                }
              </Box>
            }
            
            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'break-word', mb: 2 }}>
              {order?.description}
            </Typography>
      
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
                },
              }}
          >
            {itemImages.map((url: any, index: any) => (
            <Paper key={index} sx={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={url.path}
                alt=""
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Paper>
            ))}
          </Carousel>

          <Typography variant="body1" fontWeight="bold" >
              Quá trình
            </Typography>
          <Box sx={{ display: 'flex', justifyItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 400 }}>
              <Stepper activeStep={data.length} orientation="vertical">
                {data.map((step: any, index: any) => (
                  <Step key={index}>
                    <StepLabel
                      optional={
                        <Typography variant="caption">{formatDateTime(step.createdat)}</Typography>
                      }
                    >
                      {step.statusname}
                    </StepLabel>
                    {/* <StepContent>
                      <Typography>{formatDateTime(step.createdat)}</Typography>
                    </StepContent> */}
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          </>
        )
      }
    </Box>
  );
}

export default ViewDetailOrder;

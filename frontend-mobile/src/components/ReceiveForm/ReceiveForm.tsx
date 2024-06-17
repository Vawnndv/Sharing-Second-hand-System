import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { appInfo } from '../../constants/appInfos';
import { TextInput, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import userAPI from '../../apis/userApi';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import ContainerComponent from '../ContainerComponent';
import ItemTabComponent from '../../screens/home/components/ItemTabComponent';
import PostDetail from '../PostDetail';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { appColors } from '../../constants/appColors';
import ShowMapComponent from '../ShowMapComponent';
import TextComponent from '../TextComponent';
import { current } from '@reduxjs/toolkit';
import { HandleNotification } from '../../utils/handleNotification';
import axiosClient from '../../apis/axiosClient';


interface Props {
  postID: number;
  receiveid?: number;
  receivetype?: string;
  receivetypeid?: number;
  warehouseid?: number;
  navigation?: any;
  route?: any;
  isFetchData?: any;
  setIsFetchData: (val: any) => void;
}


interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
  longitude: string;
  latitude: string;
  addressid?: number;
}


interface FormData {
  warehouseInfo?: string;
  warehouseID?: number;
  owmerName?: string;
  ownerPhone?: string;
  ownerID?: number;
  postDate?: string;
  giveType?: string;
  address?: string;
  postTitle?: string;
  itemid? : number;
  postid? : number;
  addressGiveID? : number;
  addressReceiveID? : number;
  methodBringItemToWarehouse?: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

interface postOwnerInfo {
  owner?: number;
  address?: string;
  firstname?: string;
  lastname?: string;
  timestart?: string;
  timeend?: string;
  phonenumber?: string;
  itemid?: number;
  iswarehousepost?: any;
  longitude?: string;
  latitude?: string;


}

interface Order {
  orderid: number;
  postid: number;
  address: string;
  longitude: string;
  latitude: string;
}

interface WarehouseDropdown{
  value: string;
  label: string;
}

export interface ErrorProps  {
  bringItemToWarehouseMethod: string;
  receiveMethod: string;
  warehouseSelected: string;

}


export const ReceiveForm: React.FC<Props> = ({ navigation, route, postID, receiveid, receivetype, receivetypeid, warehouseid, setIsFetchData }) => {

  // const navigation: any = useNavigation();

  const [post, setPost] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);

  const [postOwnerInfo, setPostOwnerInfo] = useState<postOwnerInfo>();

  const [formData, setFormData] = useState<FormData>();

  const [isUserPost, setIsUserPost] = useState(false);

  const [selectedReceiveMethod, setSelectedReceiveMethod] = useState('');

  const [warehouseSeleted, setWarehouseSelected] = useState<any>(null);


  // const methodsReceive = ["Nhận đồ qua kho", "Nhận đồ trực tiếp"];

  // const methodsBringItemToWarehouse = ["Tự đem đến kho", "Nhân viên kho sẽ đến lấy"];

  const methodsBringItemToWarehouse = [
    { label: '  Tự đem đến kho', value: 1 },
    { label: '  Nhân viên kho sẽ đến lấy', value: 2 },
  ];

  const methodsReceive = [
    { label: '  Nhận đồ qua kho', value: 1 },
    { label: '  Nhận đồ trực tiếp', value: 2 },
  ];

  const [warehouse, setWarehouse] = useState<Warehouse>();


  const [warehouseDropdown, setWarehouseDropdown] = useState<any>([]);


  const [isShowAddress, setIsShowAddress] = useState(false);

  const [order, setOrder] = useState<Order>();


  const [isCompleted, setIsCompleted] = useState(false);

  const [location, setLocation] = useState<any>(null);

  const [isFetchData, setIsReFetchData] = useState(false);


  const auth = useSelector(authSelector);

  const [selectedWarehouseDropdown, setSelectedWarehouseDropdown] = useState<any>();
  const [selectedReceiveMethodDropdown, setSelectedReceiveMethodDropdown] = useState<any>();
  const [bringItemToWarehouseMethodsDropDown, setBringItemToWarehouseMethodDropdown] = useState<any>();

  

  const [isFocus, setIsFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState<ErrorProps>({
    bringItemToWarehouseMethod: '',
    receiveMethod: '',
    warehouseSelected: '',
  });

  const [validAllMethod, setValidAllMethod] = useState(false);
  const [isValidSubmit, setIsValidSubmit] = useState(false);

  useEffect(() => {
    if(warehouseSeleted){
      setIsValidSubmit(true);
    }
  },[warehouseSeleted])



  const handleValidate = (text: any, typeCheck: string) => {
    let updatedErrorMessage = {...errorMessage};

    if(typeCheck === 'bringitemtowarehousemethod'){
      if(!validAllMethod){
        updatedErrorMessage.bringItemToWarehouseMethod = 'Vui lòng chọn phương thức mang đồ đến kho.';
        setErrorMessage(updatedErrorMessage);
      }
      else{
        updatedErrorMessage.bringItemToWarehouseMethod = '';
        setErrorMessage(updatedErrorMessage);
      }
    }

    if(typeCheck === 'receivemethod' ){
      if(!validAllMethod && !selectedReceiveMethod){
        updatedErrorMessage.receiveMethod = 'Vui lòng chọn phương thức nhận đồ.';
      }
      if(warehouseSeleted && selectedReceiveMethod){
        setIsValidSubmit(true);
      }
      else{
        updatedErrorMessage.receiveMethod = '';

      }
    }


    else if(typeCheck === 'warehouseselected'){
      if(!validAllMethod){
        updatedErrorMessage.warehouseSelected = 'Vui lòng chọn kho.';
      }
      else{
        updatedErrorMessage.warehouseSelected = '';

      }
    }
    setErrorMessage(updatedErrorMessage);

  }

  useEffect(() => {

    if(isUserPost && receivetype === 'Cho nhận trực tiếp'){
      setValidAllMethod(true);
      setErrorMessage({...errorMessage, receiveMethod: '', bringItemToWarehouseMethod: '', warehouseSelected: ''})
    }

    else if(isUserPost && bringItemToWarehouseMethodsDropDown){
      setValidAllMethod(true);
      setErrorMessage({...errorMessage, receiveMethod: '', bringItemToWarehouseMethod: '', warehouseSelected: ''})

    }

    else if(selectedReceiveMethod === 'Nhận đồ trực tiếp'){
      setValidAllMethod(true);
      setErrorMessage({...errorMessage, receiveMethod: '', bringItemToWarehouseMethod: '', warehouseSelected: ''})
    }

    else if(selectedReceiveMethod === 'Nhận đồ qua kho' && warehouseSeleted){
      setValidAllMethod(true);
      setErrorMessage({...errorMessage, receiveMethod: '', bringItemToWarehouseMethod: '', warehouseSelected: ''})
    }
    else{
      setValidAllMethod(false);
    }
  },[selectedReceiveMethod, bringItemToWarehouseMethodsDropDown, warehouseSeleted])



  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const res: any = await axiosClient.get(`${appInfo.BASE_URL}/warehouse`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        let count = res.wareHouses.length;
        let warehouseArray = [];
        let temp = ''
        for(let i = 0; i< count; i++){
          temp = '  ' + res.wareHouses[i].warehousename + ', ' + res.wareHouses[i].address;
          warehouseArray.push({
            value: temp,
            label: temp
          })
        }
        setWarehouses(res.wareHouses); // Cập nhật state với dữ liệu nhận được từ API
        setWarehouseDropdown(warehouseArray);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
        const res: any = await axiosClient.get(`${appInfo.BASE_URL}/posts/postowner/${postID}`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch post owner info'); // Xử lý lỗi nếu request không thành công
        }
        setLocation({
          address: res.postOwnerInfos.address,
          latitude: parseFloat(res.postOwnerInfos.latitude),
          longitude: parseFloat(res.postOwnerInfos.longitude)
        })
        setPostOwnerInfo(res.postOwnerInfos);
        setFormData({
          ...formData,
          address: res.postOwnerInfos.address,
          owmerName: res.postOwnerInfos.firstname + ' ' + res.postOwnerInfos.lastname,
          ownerPhone: res.postOwnerInfos.phonenumber,
          ownerID: res.postOwnerInfos.owner,
          postDate: moment(res.postOwnerInfos.timestart).format('DD/MM/YYYY') + ' - ' + moment(res.postOwnerInfos.timeend).format('DD/MM/YYYY'),
          // giveType: method,
          postTitle: res.postOwnerInfos.title,
          addressGiveID: res.postOwnerInfos.addressid,
          postid: postID,
          itemid: res.postOwnerInfos.itemid,
        });
        if(auth.id == res.postOwnerInfos.owner){
          setIsUserPost(true);
        }
      } catch (error) {
        console.error('Error fetching post owner info:', error);
      } finally {
        setIsLoading(false);
      }
      try {
        setIsLoading(true);
        const res: any = await userAPI.HandleUser(`/get-profile?userId=${auth.id}`);

        // const res = await userAPI.HandleUser(`/profile?userId=${auth.id}`);
        setFormData({
          ...formData,
          addressReceiveID: res.addressid
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }

      // try {
      //   setIsLoading(true);
      //   const res = await axios.get(`${appInfo.BASE_URL}/order/getOrder/${postID}`)
      //   // const res = await postsAPI.HandlePost(
      //   //   `/${postID}`,
      //   // );
      //   if (!res) {
      //     throw new Error('Failed to fetch order'); // Xử lý lỗi nếu request không thành công
      //   }
      //   setOrder(res.data.order); // Cập nhật state với dữ liệu nhận được từ API
      // } catch (error) {
      //   console.error('Error fetching order:', error);
      // } finally {
      //   setIsLoading(false);
      // }

      try {
        // console.log(postID);
        setIsLoading(true);
        const res: any = await axiosClient.get(`${appInfo.BASE_URL}/posts/${postID}`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch post details'); // Xử lý lỗi nếu request không thành công
        }
        setPost(res.postDetail); // Cập nhật state với dữ liệu nhận được từ API
        // console.log(post?.title +  ' ' + res.postDetail.latitude);
        setIsUserPost(res.postDetail.owner == auth.id);
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching post details:', error);
      }

      if(warehouseid !== 0 && warehouseid){
        try {
          setIsLoading(true);
          const res: any = await axiosClient.get(`${appInfo.BASE_URL}/warehouse/getWarehouse/${warehouseid}`)
          // const res = await postsAPI.HandlePost(
          //   `/${postID}`,
          // );
          if (!res) {
            throw new Error('Failed to fetch warehouse'); // Xử lý lỗi nếu request không thành công
          }
          
          setWarehouse(res.wareHouse); // Cập nhật state với dữ liệu nhận được từ API
          setFormData({
            ...formData,
            warehouseInfo: res.wareHouse.warehousename + ', ' + res.wareHouse.address,
            warehouseID: res.wareHouse.warehouseid,
          });
        } catch (error) {
          console.error('Error fetching warehouse:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAllData();
}, [postID])

useEffect( () => {
  // if(!isUserPost){

  if(post){

    if (!post.iswarehousepost){
      if (isUserPost && receivetype === 'Cho nhận trực tiếp'){
        setIsValidSubmit(true);
      }
    
      else if(      
        !errorMessage.bringItemToWarehouseMethod && 
        !errorMessage.receiveMethod && 
        !errorMessage.warehouseSelected &&
        validAllMethod) {
          setIsValidSubmit(true);
      }

      else{
        setIsValidSubmit(false);
      }
    }
    else{
      setIsValidSubmit(true);
    }
}


// }

},[errorMessage, validAllMethod, isUserPost, post])


const handleReceive = async () => {

  if(!post.iswarehousepost){
    try {
      const postid = postID;
      const receiverid = auth.id; // Thay đổi giá trị này tùy theo logic ứng dụng của bạn
      const comment = '';
      const time = new Date();
      let receivertypeid = 1;
      let warehouseid = null;
      if(selectedReceiveMethod == "Nhận đồ qua kho"){
        receivertypeid = 2;
        warehouseid = warehouseSeleted.warehouseid;
      }
  
      if(selectedReceiveMethod == "Nhận đồ trực tiếp"){
        setIsShowAddress(true);
      }
      
      // console.log({title, location, description, owner, time, itemid, timestart, timeend})
      const response: any = await axiosClient.post(`${appInfo.BASE_URL}/posts/createPostReceiver`, {
        postid,
        receiverid,
        comment,
        warehouseid,
        time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
        receivertypeid,
      });       

      await HandleNotification.sendNotification({
        userReceiverId: post.owner,
        userSendId: auth.id,
        name: `${auth?.firstName} ${auth.lastName}`,
        // postid: postID,
        avatar: auth.avatar,
        link: `/post/detail/${postID}`,
        title: ' xin sản phẩm của bạn',
        body: `đã xin món đồ ${post.name} của bạn. Nhấn vào để xem thông tin cho tiết`
      })
      
      Alert.alert('Thành công', 'Gửi yêu cầu nhận hàng thành công');

      navigation.navigate('ItemDetailScreen', {
        postID: postID,
        fetchFlag: true,
      })    
    }
      catch (error) {
      console.error('Error gửi yêu cầu nhận hàng thất bại:', error);
      Alert.alert('Thất bại', 'Gửi yêu cầu nhận hàng thất bại.');
    }
  }else{
    let status = 'Chờ người nhận lấy hàng';
    let statusid = 3;
    let orderID = null;

  
      const title = post.title;
      const location = ' ';
      const description = post.description;
      const departure = post.location;
      const time = new Date();
      const itemid = post.itemid;
      const qrcode = ' ';
      const ordercode = ' ';
      const usergiveid = post.owner;
      const postid = post.postid;
      const imgconfirm = ' ';
      const locationgive = post.addressid;
      let userreceiveid = receiveid;
      let locationreceive = post.addressid;
      let givetypeid : any = receivetypeid;
      const imgconfirmreceive = ' ';
      let givetype = receivetype;
      let warehouseidPost = post.warehouseid;
  
      // let warehouseid = null;
  
      try{
        const response: any = await axiosClient.post(`${appInfo.BASE_URL}/order/createOrder`, {
          title,
          location,
          description,
          departure,
          time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
          itemid,
          status,
          qrcode,
          ordercode,
          usergiveid,
          postid,
          imgconfirm,
          locationgive,
          locationreceive,
          givetypeid: 3,
          imgconfirmreceive,
          givetype: "Cho nhận trực tiếp",
          warehouseid: warehouseidPost,
          userreceiveid: auth.id
        });
  
        console.log(response.orderCreated);
  
        orderID = response.orderCreated.orderid;    
        // if(receivetype === )
  
      const responseTrace = await axiosClient.post(`${appInfo.BASE_URL}/order/createTrace`, {
        currentstatus: status,
        orderid: orderID,
      });

      const resUpdatePost = await axiosClient.post(`${appInfo.BASE_URL}/posts/update-post-status`, {
        postid: post.postid,
        statusid: 14,
        isApproveAction: false
    });
  
  
      Alert.alert('Thành công', 'Nhận món đồ thành công.');
      setIsCompleted(true);
      navigation.navigate('Home', {screen: 'HomeScreen'})
  
    } catch(error){
      Alert.alert('Thất bại', 'Cho món đồ thất bại.');
        setIsCompleted(false);
    }
  }

}


const handleGive = async () =>{

  let status = '';
  let statusid = null;
  let orderID = null;

  if(receivetype === 'Cho nhận trực tiếp'){
    status = 'Chờ người nhận lấy hàng';
    statusid = 3;
  }

  else{
    if(formData?.methodBringItemToWarehouse === 'Tự đem đến kho'){
      status = "Chờ người cho giao hàng";
      statusid = 13;
    }
    else if(formData?.methodBringItemToWarehouse === 'Nhân viên kho sẽ đến lấy'){
      status = "Chờ cộng tác viên lấy hàng",
      statusid = 7
    }
  }

    const title = post.title;
    const location = ' ';
    const description = post.description;
    const departure = post.location;
    const time = new Date();
    const itemid = post.itemid;
    const qrcode = ' ';
    const ordercode = ' ';
    const usergiveid = post.owner;
    const postid = post.postid;
    const imgconfirm = ' ';
    const locationgive = post.addressid;
    let userreceiveid = receiveid;
    let locationreceive = null;
    let givetypeid : any = receivetypeid;
    const imgconfirmreceive = ' ';
    let givetype = receivetype;
    let warehouseidPost = post.warehouseid;

    if(receivetype !== 'Cho nhận trực tiếp' && warehouse){
      warehouseidPost = warehouseid;
      locationreceive = warehouse.addressid;
    }

    // let warehouseid = null;

    try{
      setIsLoading(true);
      const response: any = await axiosClient.post(`${appInfo.BASE_URL}/order/createOrder`, {
        title,
        location,
        description,
        departure,
        time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
        itemid,
        status,
        qrcode,
        ordercode,
        usergiveid,
        postid,
        imgconfirm,
        locationgive,
        locationreceive,
        givetypeid,
        imgconfirmreceive,
        givetype,
        warehouseid: warehouseidPost,
        userreceiveid
      });

      console.log(response.orderCreated);

      orderID = response.orderCreated.orderid;    
      // if(receivetype === )

    const responseTrace = await axiosClient.post(`${appInfo.BASE_URL}/order/createTrace`, {
      currentstatus: status,
      orderid: orderID,
    });

    const resUpdatePost = await axiosClient.post(`${appInfo.BASE_URL}/posts/update-post-status`, {
        postid: post.postid,
        statusid: 14,
        isApproveAction: false
    });

    Alert.alert('Thành công', 'Cho món đồ thành công.');
    setIsCompleted(true);

    if(receivetype !== 'Cho nhận trực tiếp' && warehouseid)
      {
        const responseTrace = await axiosClient.post(`${appInfo.BASE_URL}/card/createInputCard`, {
          qrcode: '',
          warehouseid: warehouseid,
          usergiveid: auth.id,
          orderid: orderID,
          itemid: post.itemid,
        });
      }
      
    setIsLoading(false);
    navigation.navigate('Home', {screen: 'HomeScreen'})

  } catch(error){
    Alert.alert('Thất bại', 'Cho món đồ thất bại.');
      setIsCompleted(false);
  }

  // if(receivetype === 'Cho nhận trực tiếp'){
  //   givetypeid = receivetypeid;
  //   givetype = receivetype;
  // }


  }
  



  const handleWarehouseChange = (warehouseid: number) => {
    // Tìm warehousename dựa vào warehouseid
    const selectedWarehouse = wareHouses.find(wareHouse => wareHouse.warehouseid === warehouseid);
    
    if (selectedWarehouse) {
      // Nếu tìm thấy warehouse, cập nhật formData với warehousename mới
      setFormData({
        ...formData,
        warehouseInfo: selectedWarehouse.warehousename + ', ' + selectedWarehouse.address,
        warehouseID: selectedWarehouse.warehouseid,
      });
    }
  };


  const handleBringItemToWareHouseChange = (methodBringItemToWarehouse: string) => {
    console.log('ĐEM ĐỒ ĐẾN KHO:', methodBringItemToWarehouse)
    setFormData({
      ...formData,
      methodBringItemToWarehouse: methodBringItemToWarehouse
    });
  }

  const handleSelectWarehouse = () => {
    navigation.navigate('MapSelectWarehouseGiveScreen', {
      warehouses: wareHouses,
      setWarehouseSelected: setWarehouseSelected
    })

    setErrorMessage({...errorMessage, warehouseSelected: ''});
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log(location)



  return (
  <ScrollView style = {styles.container}>
    {!isUserPost && (
      <Text style={styles.title}>Thông tin nhận đồ </Text>
    )}
    {isUserPost && (
      <Text style={styles.title}>Thông tin cho đồ </Text>
    )}
    

    <TextInput
      label="Tên người cho"
      value={postOwnerInfo?.firstname + ' ' + postOwnerInfo?.lastname}
      // onChangeText={(text) => setFormData({ ...formData, owmerName: text })}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      editable={false} // Ngăn không cho người dùng nhập vào

    />
    
    <TextInput
      label="Số điện thoại"
      value={postOwnerInfo?.phonenumber}
      // onChangeText={(text) => setFormData({ ...formData, itemQuantity: text })}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      editable={false} // Ngăn không cho người dùng nhập vào

    />

    <TextInput
      label="Ngày nhận"
      value={moment(postOwnerInfo?.timestart).format('DD/MM/YYYY') + ' - ' + moment(postOwnerInfo?.timeend).format('DD/MM/YYYY')}
      // onChangeText={(text) => setFormData({ ...formData, postDate: text })}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      multiline={true} // Cho phép nhập nhiều dòng văn bản
      numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
      editable={false} // Ngăn không cho người dùng nhập vào

    />  

    {!isUserPost && !postOwnerInfo?.iswarehousepost && (
      <>
        <Dropdown
          style={[styles.dropdown, isFocus ? { borderColor: 'blue', borderBottomWidth: 2 } : errorMessage.receiveMethod ? {borderColor: appColors.danger, borderBottomWidth: 2} : { borderColor: 'gray'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}

          iconStyle={styles.iconStyle}
          data={methodsReceive}
          // search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? '  Phương thức nhận đồ' : '...'}
          searchPlaceholder="Tìm kiếm..."
          value={selectedReceiveMethodDropdown}
          onFocus={() => {
            setIsFocus(true);
            handleValidate( selectedReceiveMethod,'receivemethod');
          }}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedReceiveMethodDropdown(item.value);
            setIsFocus(false);
            setSelectedReceiveMethod(item.label.substring(2));
            setErrorMessage({...errorMessage, receiveMethod: ''})

          }}
        />
        {(errorMessage.receiveMethod) && <TextComponent text={errorMessage.receiveMethod}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
      </>
    )}

    {!isUserPost && selectedReceiveMethod == 'Nhận đồ qua kho' && !postOwnerInfo?.iswarehousepost && (

      <>
        <TextInput
          label="Kho"
          value={warehouseSeleted ? `${warehouseSeleted.warehousename}, ${warehouseSeleted.address}`  : ''}
          style={styles.input}
          multiline
          underlineColor="transparent" // Màu của gạch chân khi không focus
          editable={false} // Người dùng không thể nhập trực tiếp vào trường này
          // error={errorMessage.warehouseAddress? true : false}
          // onBlur={() => handleValidate(formData.itemPhotos,'photo')}
          theme={{
            colors: {
              error: appColors.danger, 
            },
          }}
        />
        {/* {(errorMessage.warehouseSelected) && <TextComponent text={errorMessage.warehouseSelected}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>} */}

        <Button 
          icon="warehouse" 
          mode="contained" 
          onPress={() => {
            handleSelectWarehouse();    
            setErrorMessage({...errorMessage, warehouseSelected: ''});
            // setIsValidSubmit(true);          
          }} 
          style={styles.button}>
          Chọn kho
        </Button>
      </>
      
    )}

    {!isUserPost && selectedReceiveMethod == 'Nhận đồ trực tiếp' && !postOwnerInfo?.iswarehousepost && (
      <>
        <TextInput
          label="Địa chỉ đến lấy đồ"
          value={postOwnerInfo?.address}
          style={styles.input}
          underlineColor="gray" // Màu của gạch chân khi không focus
          activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
          multiline={true} // Cho phép nhập nhiều dòng văn bản
          numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
          editable={false} // Ngăn không cho người dùng nhập vào

        /> 
        {
          location && 
          <ShowMapComponent
            location={location}
            setLocation={setLocation}
            useTo='no'
          />
        }

        
      </>

    )}
    

    {!isUserPost && postOwnerInfo?.iswarehousepost && (
      <TextInput
        label="Địa chỉ đến lấy đồ"
        value={postOwnerInfo?.address}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        multiline={true} // Cho phép nhập nhiều dòng văn bản
        numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
        editable={false} // Ngăn không cho người dùng nhập vào
      /> 
    )}

    
    {isUserPost && (
      <TextInput
      label="Địa chỉ"
      value={postOwnerInfo?.address}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      multiline={true} // Cho phép nhập nhiều dòng văn bản
      numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
      editable={false} // Ngăn không cho người dùng nhập vào

    /> 
    )}

    {isUserPost && (
      <TextInput
      label="Phương thức cho"
      value={receivetype}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      multiline={true} // Cho phép nhập nhiều dòng văn bản
      numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
      editable={false} // Ngăn không cho người dùng nhập vào
    /> 
    )}


    {isUserPost && receivetype == 'Cho nhận qua kho' && (
      <>
        <TextInput
        label="Thông tin kho"
        value={formData?.warehouseInfo}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        multiline={true} // Cho phép nhập nhiều dòng văn bản
        numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
        editable={false} // Ngăn không cho người dùng nhập vào
        /> 

        {
          warehouse && 
          <ShowMapComponent
            location={{ 
              address: warehouse.address,
              longitude: parseFloat(warehouse.longitude),
              latitude: parseFloat(warehouse.latitude)
              }}
            useTo='no'
          />
        }

      
      </>
    )}

    {isUserPost && receivetype == 'Cho nhận qua kho' && (
      <>
        <Dropdown
          style={[styles.dropdown, isFocus ? { borderColor: 'blue', borderBottomWidth: 2 } : errorMessage.bringItemToWarehouseMethod ? {borderColor: appColors.danger, borderBottomWidth: 2} : { borderColor: 'gray'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={methodsBringItemToWarehouse}
          // search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? '  Phương thức đem đồ đến kho' : '...'}
          // searchPlaceholder="Tìm kiếm..."
          value={bringItemToWarehouseMethodsDropDown}
          onFocus={() => {
            setIsFocus(true);
            handleValidate(formData?.methodBringItemToWarehouse ,'bringitemtowarehousemethod')
          }}
          onBlur={() => {
            if(isFocus){
              // handleValidate(formData?.methodBringItemToWarehouse ,'bringitemtowarehousemethod')
            }
            setIsFocus(false);

          }}
          onChange={item => {
            setBringItemToWarehouseMethodDropdown(item.value);
            setIsFocus(false);
            handleBringItemToWareHouseChange(item.label.substring(2));
            // handleValidate(bringItemToWarehouseMethodsDropDown ,'bringitemtowarehousemethod')
            setErrorMessage({...errorMessage, bringItemToWarehouseMethod: ''})

          }}
        />
        {(errorMessage.bringItemToWarehouseMethod) && <TextComponent text={errorMessage.bringItemToWarehouseMethod}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
      </>
    )}




    {!isUserPost && (
      <Button mode="contained" onPress={handleReceive} disabled={!isValidSubmit}>Xác nhận</Button>
    )}

    {isUserPost && (
      <Button mode="contained" onPress={handleGive} disabled={!isValidSubmit} >Xác nhận</Button>
    )}
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-around'
  },
  title: {
    fontSize: 20,
    marginBottom: 40,
    color: 'black',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownText: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    
  },
  inputDropDown: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(200, 200, 200)',
    fontSize: 15,
    padding: 15,
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    marginBottom: '10%'
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    borderWidth: 0
  },
  selectedTextStyle: {
    fontSize: 14,
    borderWidth: 0

  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
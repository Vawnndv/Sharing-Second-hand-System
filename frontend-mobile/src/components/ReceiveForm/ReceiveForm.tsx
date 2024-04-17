import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import { appInfo } from '../../constants/appInfos';
import { TextInput, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import userAPI from '../../apis/userApi';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import ContainerComponent from '../ContainerComponent';
import ItemTabComponent from '../../screens/home/components/ItemTabComponent';
import PostDetail from '../PostDetail';
import { useNavigation } from '@react-navigation/native';



interface Props {
  postID: number;
  receiveid?: number;
  receivetype?: string;
  receivetypeid?: number;
  warehouseid?: number;
}


interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
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


}

interface Order {
  orderid: number;
  postid: number;
}



export const ReceiveForm: React.FC<Props> = ({  postID, receiveid, receivetype, receivetypeid, warehouseid }) => {

  const navigation: any = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);

  const [postOwnerInfo, setPostOwnerInfo] = useState<postOwnerInfo>();

  const [formData, setFormData] = useState<FormData>();

  const [isUserPost, setIsUserPost] = useState(false);

  const [selectedReceiveMethod, setSelectedReceiveMethod] = useState(' ');

  const methodsReceive = ["Nhận đồ qua kho", "Nhận đồ trực tiếp"];

  const methodsBringItemToWarehouse = ["Tự đem đến kho", "Nhân viên kho sẽ đến lấy"];

  const [warehouse, setWarehouse] = useState<Warehouse>();


  const [isShowAddress, setIsShowAddress] = useState(false);

  const [order, setOrder] = useState<Order>();


  const [isCompleted, setIsCompleted] = useState(false);


  const auth = useSelector(authSelector);




  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/warehouse`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        setWarehouses(res.data.wareHouses); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/posts/postowner/${postID}`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch post owner info'); // Xử lý lỗi nếu request không thành công
        }
        setPostOwnerInfo(res.data.postOwnerInfos);
        setFormData({
          ...formData,
          address: res.data.postOwnerInfos.address,
          owmerName: res.data.postOwnerInfos.firstname + ' ' + res.data.postOwnerInfos.lastname,
          ownerPhone: res.data.postOwnerInfos.phonenumber,
          ownerID: res.data.postOwnerInfos.owner,
          postDate: moment(res.data.postOwnerInfos.timestart).format('DD/MM/YYYY') + ' - ' + moment(res.data.postOwnerInfos.timeend).format('DD/MM/YYYY'),
          // giveType: method,
          postTitle: res.data.postOwnerInfos.title,
          addressGiveID: res.data.postOwnerInfos.addressid,
          postid: postID,
          itemid: res.data.postOwnerInfos.itemid,
        });
        if(auth.id == res.data.postOwnerInfos.owner){
          setIsUserPost(true);
        }
      } catch (error) {
        console.error('Error fetching post owner info:', error);
      } finally {
        setIsLoading(false);
      }
      try {
        setIsLoading(true);
        const res = await userAPI.HandleUser(`/get-profile?userId=${auth.id}`);

        // const res = await userAPI.HandleUser(`/profile?userId=${auth.id}`);
        setFormData({
          ...formData,
          addressReceiveID: res.data.addressid
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/order/getOrder/${postID}`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch order'); // Xử lý lỗi nếu request không thành công
        }
        setOrder(res.data.order); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }

      if(warehouseid != 0 && warehouseid){
        try {
          setIsLoading(true);
          const res = await axios.get(`${appInfo.BASE_URL}/warehouse/getWarehouse/${warehouseid}`)
          // const res = await postsAPI.HandlePost(
          //   `/${postID}`,
          // );
          if (!res) {
            throw new Error('Failed to fetch warehouse'); // Xử lý lỗi nếu request không thành công
          }
          
          setWarehouse(res.data.wareHouse); // Cập nhật state với dữ liệu nhận được từ API
          setFormData({
            ...formData,
            warehouseInfo: res.data.wareHouse.warehousename + ', ' + res.data.wareHouse.address,
            warehouseID: res.data.wareHouse.warehouseid,
          });
        } catch (error) {
          console.error('Error fetching warehouse:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchWarehouses();
}, [])


const handleReceive = async () => {
  try {
    const postid = postID;
    const receiverid = auth.id; // Thay đổi giá trị này tùy theo logic ứng dụng của bạn
    const comment = '';
    const time = new Date();
    let receivertypeid = 1;
    let warehouseid = null;
    if(selectedReceiveMethod == "Nhận đồ qua kho"){
      receivertypeid = 2;
      warehouseid = formData?.warehouseID;
    }

    if(selectedReceiveMethod == "Nhận đồ trực tiếp"){
      setIsShowAddress(true);
    }
    
    // console.log({title, location, description, owner, time, itemid, timestart, timeend})
    const response = await axios.post(`${appInfo.BASE_URL}/posts/createPostReceiver`, {
      postid,
      receiverid,
      comment,
      warehouseid,
      time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
      receivertypeid,
    });       
    Alert.alert('Thành công', 'Gửi yêu cầu nhận hàng thành công');
    navigation.navigate('ItemDetailScreen', {
      postID: postID,
    })
    
  } catch (error) {
    console.error('Error gửi yêu cầu nhận hàng thất bại:', error);
    Alert.alert('Error', 'Gửi yêu cầu nhận hàng thất bại.');
  }
}


const handleGive = async () =>{
  if(receivetype == 'Cho nhận trực tiếp'){
    const orderid = order?.orderid;
    const userreceiveid = receiveid;
    const givetypeid = receivetypeid;
    const givetype = receivetype;
    
    try{
      const response = await axios.post(`${appInfo.BASE_URL}/order/updateOrderReceiver`, {
        orderid,
        userreceiveid,
        givetypeid,
        givetype
      })
      Alert.alert('Thành công', 'Cho món đồ thành công');
      navigation.navigate('ItemDetailScreen', {
        postID: postID,
      })

    } catch(error){
      Alert.alert('Error', 'Cho món đồ thất bại.');
      setIsCompleted(false);

    }
  }

  if(receivetype == 'Cho nhận qua kho'){
    const orderid = order?.orderid;
    const userreceiveid = receiveid;
    let givetypeid = receivetypeid;
    let givetype = receivetype;
    if(formData?.methodBringItemToWarehouse == 'Tự mang đồ đến kho'){
      try{
        const response = await axios.post(`${appInfo.BASE_URL}/order/updateOrderReceiver`, {
          orderid,
          userreceiveid,
          givetypeid,
          givetype
        })
        Alert.alert('Thành công', 'Cho món đồ thành công');

      } catch(error){
        Alert.alert('Error', 'Cho món đồ thất bại.');
        setIsCompleted(false);
      }
    }
    


    if(formData?.methodBringItemToWarehouse == 'Nhân viên kho sẽ đến lấy'){
      try{
        givetypeid = 5;
        givetype = 'Cho nhận qua kho(kho đến lấy)';
        const response = await axios.post(`${appInfo.BASE_URL}/order/updateOrderReceiver`, {
          orderid,
          userreceiveid,
          givetypeid,
          givetype
        })
        Alert.alert('Thành công', 'Cho món đồ thành công');

      } catch(error){
        Alert.alert('Error', 'Cho món đồ thất bại.');
        setIsCompleted(false);

      }
    }

    try{
      const qrcode = ' ';
      const usergiveid = postOwnerInfo?.owner;
      const itemid = postOwnerInfo?.itemid;
      const orderid = order?.orderid;

      const response = await axios.post(`${appInfo.BASE_URL}/card/createInputCard`, {
        qrcode,
        warehouseid,
        orderid,
        usergiveid,
        itemid
      })

      Alert.alert('Thành công', 'Tạo input card thành công');
      navigation.navigate('ItemDetailScreen', {
        postID: postID,
      })
      // setIsCompleted(true);
      // navigation.navigate('Home', {screen: 'HomeScreen'})


    } catch(error){
      Alert.alert('Error', 'Tạo input card thất bại.');
      // setIsCompleted(false);
    }
  }
  }
  






  const handleWarehouseChange = (warehouseInfo: string) => {
    // Tìm warehousename dựa vào warehouseid
    const selectedWarehouse = wareHouses.find(wareHouse => wareHouse.warehousename + ', ' + wareHouse.address === warehouseInfo);
    
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
    setFormData({
      ...formData,
      methodBringItemToWarehouse: methodBringItemToWarehouse
    });
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }



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

    {!isUserPost && (
      <RNPickerSelect
        onValueChange={(value) => setSelectedReceiveMethod(value)}
        items={methodsReceive.map((method) => ({ label: method, value: method }))}
        value={selectedReceiveMethod}
        placeholder={{ label: 'Chọn phương thức nhận' }}
        style={{
          inputIOS: {
            ...styles.inputDropDown,
            color: 'black', // Đảm bảo rằng màu sắc không đổi sau khi chọn
          },
          inputAndroid: {
            ...styles.inputDropDown,
            color: 'black', // Đảm bảo rằng màu sắc không đổi sau khi chọn
          },
          placeholder: {
            color: 'black', // Màu của chữ label khi chưa chọn
            fontSize: 14,
            // enabled: false
          },
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => <MaterialIcons name="arrow-drop-down" size={24} color="gray" style = {{padding: 25}} />}
      />
    )}

    {!isUserPost && selectedReceiveMethod == 'Nhận đồ qua kho' && (
      <RNPickerSelect
          onValueChange={(value) => handleWarehouseChange(value)}
          items={wareHouses.map((wareHouse) => ({ label: wareHouse.warehousename + ', ' + wareHouse.address, value: wareHouse.warehousename + ', ' + wareHouse.address }))}
          value={formData?.warehouseInfo}
          placeholder={{ label: 'Chọn kho'}}
          style={{
            inputIOS: {
              ...styles.inputDropDown,
              color: 'black', // Đảm bảo rằng màu sắc không đổi sau khi chọn
            },
            inputAndroid: {
              ...styles.inputDropDown,
              color: 'black', // Đảm bảo rằng màu sắc không đổi sau khi chọn
            },
            placeholder: {
              color: 'black', // Màu của chữ label khi chưa chọn
              fontSize: 14,
              // enabled: false
            },
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => <MaterialIcons name="arrow-drop-down" size={24} color="gray" style = {{padding: 25}} />}
      />
    )}

    {!isUserPost && selectedReceiveMethod == 'Nhận đồ trực tiếp' && (
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
    )}

    {isUserPost && receivetype == 'Cho nhận qua kho' && (
      <RNPickerSelect
          onValueChange={(value) => handleBringItemToWareHouseChange(value)}
          items={methodsBringItemToWarehouse.map((methodBringItemToWarehouse) => ({ label: methodBringItemToWarehouse, value: methodBringItemToWarehouse}))}
          value={formData?.methodBringItemToWarehouse}
          placeholder={{ label: 'Chọn phương thức đem đồ đến kho'}}
          style={{
            inputIOS: {
              ...styles.inputDropDown,
              color: 'black', // Đảm bảo rằng màu sắc không đổi sau khi chọn
            },
            inputAndroid: {
              ...styles.inputDropDown,
              color: 'black', // Đảm bảo rằng màu sắc không đổi sau khi chọn
            },
            placeholder: {
              color: 'black', // Màu của chữ label khi chưa chọn
              fontSize: 14,
              // enabled: false
            },
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => <MaterialIcons name="arrow-drop-down" size={24} color="gray" style = {{padding: 25}} />}
      />
    )}




    {!isUserPost && (
      <Button mode="contained" onPress={handleReceive}>Xác nhận</Button>
    )}

    {isUserPost && (
      <Button mode="contained" onPress={handleGive}>Xác nhận</Button>
    )}
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 40,
    color: 'black',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    marginBottom: 20,
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
  }
});
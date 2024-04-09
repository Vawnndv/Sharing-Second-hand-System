import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { appInfo } from '../../constants/appInfos';
import { TextInput, Button } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import userAPI from '../../apis/userApi';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';



interface Props {
  method: string;
  postID: number
}


interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
}


interface FormData {
  warehouseInfo?: string;
  owmerName?: string;
  ownerPhone?: string;
  postDate?: string;
  giveType?: string;
  address?: string;
  postTitle?: string;
  itemid? : number;
  postid? : number;
  addressGiveID? : number;
  addressReceiveID? : number;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}



export const ReceiveForm: React.FC<Props> = ({ method, postID }) => {

  const [isLoading, setIsLoading] = useState(false);

  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);

  const [postOwnerInfo, setPostOwnerInfo] = useState();

  const [formData, setFormData] = useState<FormData | undefined>();


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
        console.log(res.data.wareHouses);
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
        console.log(res.data.postOwnerInfos);
        setPostOwnerInfo(res.data.postOwnerInfos); // Cập nhật state với dữ liệu nhận được từ API
        setFormData({
          ...formData,
          owmerName: res.data.postOwnerInfos.firstname + ' ' + res.data.postOwnerInfos.lastname,
          ownerPhone: res.data.postOwnerInfos.phonenumber,
          postDate: moment(res.data.postOwnerInfos.timestart).format('DD/MM/YYYY') + ' - ' + moment(res.data.postOwnerInfos.timeend).format('DD/MM/YYYY'),
          giveType: method,
          postTitle: res.data.postOwnerInfos.title,
          addressGiveID: res.data.postOwnerInfos.addressid,
          postid: postID,
          itemid: res.data.postOwnerInfos.itemid,
        });
      } catch (error) {
        console.error('Error fetching post owner info:', error);
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
        const res = await userAPI.HandleUser(`/profile?userId=${auth.id}`);
        setFormData({
          ...formData,
          addressReceiveID: res.data.addressid
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }

    };
    fetchWarehouses();
}, [])

  const handleWarehouseChange = (warehouseId: number) => {
    // Tìm warehousename dựa vào warehouseid
    const selectedWarehouse = wareHouses.find(wareHouse => wareHouse.warehouseid === warehouseId);
    
    if (selectedWarehouse) {
      // Nếu tìm thấy warehouse, cập nhật formData với warehousename mới
      setFormData({
        ...formData,
        warehouseInfo: selectedWarehouse.warehousename + ', ' + selectedWarehouse.address,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
}
  return (
    <ScrollView style = {styles.container}>
    <Text style={styles.title}>Thông tin nhận đồ </Text>
    <TextInput
      label="Tên người cho"
      value={formData?.owmerName ? formData.owmerName : ' ' }
      // onChangeText={(text) => setFormData({ ...formData, owmerName: text })}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
    />
    
    <TextInput
      label="Số điện thoại"
      value={formData?.ownerPhone ? formData.ownerPhone : ' '}
      // onChangeText={(text) => setFormData({ ...formData, itemQuantity: text })}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
    />

    <TextInput
      label="Ngày nhận"
      value={formData?.postDate}
      // onChangeText={(text) => setFormData({ ...formData, postDate: text })}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      multiline={true} // Cho phép nhập nhiều dòng văn bản
      numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
    />  

    <TextInput
      label="Phương thức nhận"
      value={formData?.giveType}
      // onChangeText={(text) => setFormData({ ...formData, postDate: text })}
      style={styles.input}
      underlineColor="gray" // Màu của gạch chân khi không focus
      activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      multiline={true} // Cho phép nhập nhiều dòng văn bản
      numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
    />  

    <RNPickerSelect
        onValueChange={(value) => handleWarehouseChange(value)}
        items={wareHouses.map((wareHouse) => ({ label: wareHouse.warehousename + ', ' + wareHouse.address, value: wareHouse.warehouseid }))}
        value={formData?.warehouseInfo}
        placeholder={{ label: 'Chọn kho', borderBottomColor: 'black', borderWidth: 1, color: '#4B0082', fontWeight: 'boldẻ'}}
        style={{
          inputIOS: styles.inputDropDown,
          inputAndroid: styles.inputDropDown,
          placeholder: {
            color: 'black', // Màu của chữ label
          },
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => <MaterialIcons name="arrow-drop-down" size={24} color="gray" style = {{padding: 25}} />}
    />



    <Button mode="contained" >Xác nhận</Button>
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
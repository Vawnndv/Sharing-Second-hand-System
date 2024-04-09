import React, { useEffect, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons từ thư viện
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { appInfo } from '../../constants/appInfos';



interface FormData {
  itemName: string;
  itemPhotos: any[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc
  itemCategory: string;
  itemQuantity: string;
  itemDescription: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

interface ItemTypes {
  itemtypeid: number;
  nametype: string;
}


interface StepOneProps {
  setStep: (step: number) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
}

const itemCategories = ['1', '2', '3'];


const StepOne: React.FC<StepOneProps> = ({ setStep, formData, setFormData }) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [itemTypes, setItemTypes] = useState<ItemTypes[]>([]);


  console.log(formData.itemPhotos)

  useEffect(() => {
    const fetchItemTypes = async () => {
      let itemIDs = null;
      let owner = null
      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/types`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch item types'); // Xử lý lỗi nếu request không thành công
        }
        console.log(res.data.itemTypes);
        setItemTypes(res.data.itemTypes); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching item types:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItemTypes();
}, [])

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Bạn cần cấp quyền truy cập thư viện ảnh!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageData = pickerResult.assets.map((asset) => {
        return {
          uri: asset.uri,
          name: new Date().getTime(),
          type: asset.mimeType
        }
      });
      // const finalResult = {
      //   ri: result.assets[0].uri,
      //   name: new Date().getTime(),
      //   type: result.assets[0].mimeType,
      // }
      // setImage(finalResult);
      setFormData({ ...formData, itemPhotos: [...formData.itemPhotos, ...imageData] }); // Cập nhật đường dẫn của các ảnh vào formData
    }
  };

  const removeImage = (index: number) => {
    const updatedPhotos = [...formData.itemPhotos];
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, itemPhotos: updatedPhotos });
  };

  const handleNext = () => {
    // Kiểm tra các trường bắt buộc
    if (!formData.itemName.trim()) {
      alert('Tên món đồ là bắt buộc.');
      return;
    }
    if (formData.itemPhotos.length < 1) {
      alert('Vui lòng cung cấp cho chúng tôi ít nhất là 1 tấm ảnh của món đồ.');
      return;
    }

    if (!formData.itemQuantity.trim()) {
      alert('Số lượng là bắt buộc.');
      return;
    }

    if (!formData.itemCategory) {
      alert('Loại món đồ là bắt buộc.');
      return;
    }

    setStep(2);

    // Tiếp tục xử lý submit form ở đây
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
      <Text style={styles.title}>Thông tin sản phẩm </Text>
      <TextInput
        label="Tên món đồ"
        value={formData.itemName}
        onChangeText={(text) => setFormData({ ...formData, itemName: text })}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      />
      <TextInput
          label="Ảnh của món đồ"
          style={styles.input}
          underlineColor="transparent" // Màu của gạch chân khi không focus
          editable={false} // Người dùng không thể nhập trực tiếp vào trường này
        />
        {/* Hiển thị ảnh đã chọn */}
      <ScrollView horizontal>
          {formData.itemPhotos.map((image: any, index) => (
            <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity onPress={() => removeImage(index)} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ))}
      </ScrollView>
      <Button icon="camera" mode="contained" onPress={pickImage} style={styles.button}>
        Chọn Ảnh
      </Button>
      <TextInput
        label="Số lượng"
        value={formData.itemQuantity}
        onChangeText={(text) => setFormData({ ...formData, itemQuantity: text })}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      />

      <RNPickerSelect
        onValueChange={(value) => setFormData({ ...formData, itemCategory: value })}
        items={itemTypes.map((category) => ({ label: category.nametype, value: category.itemtypeid }))}
        value={formData.itemCategory}
        placeholder={{ label: 'Chọn loại món đồ' }}
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
      <TextInput
        label="Mô tả về món đồ"
        value={formData.itemDescription}
        onChangeText={(text) => setFormData({ ...formData, itemDescription: text })}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        multiline={true} // Cho phép nhập nhiều dòng văn bản
        numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
      />  
      <Button mode="contained" onPress={handleNext}>Tiếp theo</Button>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
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

export default StepOne;
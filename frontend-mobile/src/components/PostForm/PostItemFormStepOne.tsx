import React, { useEffect, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons từ thư viện
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { appInfo } from '../../constants/appInfos';
import { Dropdown } from 'react-native-element-dropdown';
import { ProfileModel } from '../../models/ProfileModel';
import { appColors } from '../../constants/appColors';
import TextComponent from '../TextComponent';
import { useNavigation } from '@react-navigation/native';

// import { Picker } from '@react-native-picker/picker';

interface ErrorProps  {
  itemName: string;
  itemPhotos: string;
  itemQuantity: string;
  itemCategory: string;
  methodGive: string;
  itemDescription: string;
  methodsBringItemToWarehouse: string;
  warehouseAddress: string;
}

interface FormData {
  itemName: string;
  itemPhotos: any[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc
  itemCategory: string;
  itemQuantity: string;
  itemDescription: string;
  methodGive: string;
  methodsBringItemToWarehouse?: string;
  warehouseAddress?: string;
  warehouseAddressID?: number;
  warehouseID?: number;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

interface ItemTypes {
  itemtypeid: number;
  nametype: string;
}

interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
  addressid: number;
  longitude: string;
  latitude: string;
}

interface StepOneProps {
  setStep: (step: number) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  warehouseSelected: any,
  setWarehouseSelected: any
}


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const StepOne: React.FC<StepOneProps> = ({ setStep, formData, setFormData, warehouseSelected, setWarehouseSelected }) => {

  const [isLoading, setIsLoading] = useState(false);

  const [itemTypes, setItemTypes] = useState<ItemTypes[]>([]);

  const [itemTypesDropdown, setItemTypesDropdown] = useState<any>([]);

  const [errorMessage, setErrorMessage] = useState<ErrorProps>({
    itemName: '',
    itemPhotos: '',
    itemQuantity: '',
    itemCategory: '',
    methodGive: '',
    itemDescription: '',
    methodsBringItemToWarehouse: '',
    warehouseAddress: '',
  });


  // const methodsGive = ["Đăng món đồ lên hệ thống ứng dụng", "Gửi món đồ đến kho"];

  const methodsGive = [
    { label: "  Đăng món đồ lên hệ thống ứng dụng", value: "  Đăng món đồ lên hệ thống ứng dụng" },
    { label: "  Gửi món đồ đến kho", value: "  Gửi món đồ đến kho" },
  ];

  // const methodsBringItemToWarehouse = ["Tự đem đến kho", "Nhân viên kho sẽ đến lấy"];

  const methodsBringItemToWarehouse = [
    { label: "  Tự đem đến kho", value: "  Tự đem đến kho" },
    { label: "  Nhân viên kho sẽ đến lấy", value: "  Nhân viên kho sẽ đến lấy" },
  ];


  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);


  const [warehouseDropdown, setWarehouseDropdown] = useState<any>([])

  const [isWarehouseGive, setIsWareHouseGive] = useState(false);

  const [isBringItemToWarehouse, setIsBringItemToWareHouse] = useState(false);

  const [selectedItemTypeDropdown, setSelectedItemTypeDropdown] = useState<any>(null);

  const [selectedWarehouseDropdown, setSelectedWarehouseDropdown] = useState<any>();

  const [selectedMethodGive, setSelectedMethodGive] = useState<any>();

  const [bringItemToWarehouseMethodsDropDown, setBringItemToWarehouseMethodDropdown] = useState<any>();


  const [isFocusMethodGive, setIsFocusMethodGive] = useState(false);

  const [isFocusBringItemToWarehouse, setIsFocusBringItemToWarehouse] = useState(false);

  const [isFocusSelectedItemType, setIsFocusSelectedItemType] = useState(false);

  const [isFocusSelectedWarehouse, setIsFocusSelectedWarehouse] = useState<any>();

  const navigation: any = useNavigation();

  const [isValidNext, setIsValidNext] = useState(false);

  const [validAllMethod, setValidAllMethod] = useState(false);

  const [isUploaded, setIsUpdloaded] = useState(false);




  useEffect(() => {
    if(formData.methodGive == 'Đăng món đồ lên hệ thống ứng dụng'){
      setValidAllMethod(true);
    }
    else if(formData.methodGive == 'Gửi món đồ đến kho' && formData.methodsBringItemToWarehouse == 'Nhân viên kho sẽ đến lấy'){
      setValidAllMethod(true);
    }
    else if(formData.methodGive == 'Gửi món đồ đến kho' && formData.methodsBringItemToWarehouse == 'Tự đem đến kho' && formData.warehouseAddress != 'Chọn kho'){
      setValidAllMethod(true);
    }
    else{
      setValidAllMethod(false);

    }
  },[formData])

  useEffect(() => {
    if(formData?.methodGive == 'Gửi món đồ đến kho'){
      setIsWareHouseGive(true);
    }
    else{
      setIsWareHouseGive(false);
    }
  }, [formData.methodGive])

  useEffect(() => {
    if(formData.methodsBringItemToWarehouse == 'Tự đem đến kho'){
      setIsBringItemToWareHouse(true);
    }
    else{
      setIsBringItemToWareHouse(false);
    }
  }, [formData.methodsBringItemToWarehouse])


  useEffect(() =>{
    if (formData.warehouseAddress){
      setSelectedWarehouseDropdown('  ' + formData.warehouseAddress)
    }

    if (formData.itemCategory){
      setSelectedItemTypeDropdown(formData.itemCategory)
    }

    if (formData.methodGive){
      setSelectedMethodGive('  ' + formData.methodGive)
    }

    if (formData.methodsBringItemToWarehouse){
      setBringItemToWarehouseMethodDropdown('  ' + formData.methodsBringItemToWarehouse)
    }

  },[formData])

  useEffect(() =>{
    if(isUploaded){
      let updatedErrorMessage = {...errorMessage};
      if (formData.itemPhotos.length < 1) {
        updatedErrorMessage.itemPhotos = 'Vui lòng cung cấp cho chúng tôi ít nhất là 1 tấm ảnh của món đồ.';
      } else {
        updatedErrorMessage.itemPhotos = '';
      }
      setErrorMessage(updatedErrorMessage);
    }
  },[formData.itemPhotos])

  useEffect(() => {
    if(warehouseSelected){
      handleWarehouseChange(warehouseSelected.warehouseid);
    }
  },[warehouseSelected])


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/items/types`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch item types'); // Xử lý lỗi nếu request không thành công
        }

        let count = res.data.itemTypes.length;
        let itemTypesArray = [];
        for(let i = 0; i< count; i++){
          itemTypesArray.push({
            value: res.data.itemTypes[i].itemtypeid,
            label: '  ' + res.data.itemTypes[i].nametype
          })
        }
        setItemTypesDropdown(itemTypesArray);
        setItemTypes(res.data.itemTypes); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching item types:', error);
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/warehouse`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        let count = res.data.wareHouses.length;
        let warehouseArray = [];
        let temp = ''
        for(let i = 0; i< count; i++){
          temp = '  ' + res.data.wareHouses[i].warehousename + ', ' + res.data.wareHouses[i].address;
          warehouseArray.push({
            value: temp,
            label: temp
          })
        }
        setWarehouses(res.data.wareHouses); // Cập nhật state với dữ liệu nhận được từ API
        setWarehouseDropdown(warehouseArray);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setIsLoading(false);
      }
      
    };
    fetchAllData();
}, [])


  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setIsUpdloaded(true);

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
      const imageData = pickerResult.assets.map((asset: any) => {
        return {
          uri: asset.uri,
          name: new Date().getTime() + asset.fileName,
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
      handleValidate('','photo');
    }
  };

  const removeImage = (index: number) => {
    const updatedPhotos = [...formData.itemPhotos];
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, itemPhotos: updatedPhotos });
    handleValidate('','photo');
  };

  const handleWarehouseChange = (warehouseID: number) => {
    // Tìm warehousename dựa vào warehouseid
    const selectedWarehouse = wareHouses.find(wareHouse => wareHouse.warehouseid === warehouseID);

    if (selectedWarehouse) {
      // Nếu tìm thấy warehouse, cập nhật formData với warehousename mới
      setFormData({
        ...formData,
        warehouseAddress: selectedWarehouse.warehousename + ', ' + selectedWarehouse.address,
        warehouseAddressID: selectedWarehouse.addressid,
        warehouseID: selectedWarehouse.warehouseid
      });
      setErrorMessage({...errorMessage, warehouseAddress: ''})
    }
  };

  

  const handleValidate = (text: any, typeCheck: string) =>  {
    let updatedErrorMessage = {...errorMessage};
    // Kiểm tra các trường bắt buộc

    if(typeCheck == 'itemname'){
      if (!text.trim()) {
        updatedErrorMessage.itemName = 'Tên món đồ là bắt buộc.';
        setFormData({ ...formData, itemName: '' });

      } else {
        updatedErrorMessage.itemName = '';
        setFormData({ ...formData, itemName: text });
      }
    }

    if(typeCheck == 'photo'){
      if (formData.itemPhotos.length < 1) {
        updatedErrorMessage.itemPhotos = 'Vui lòng cung cấp cho chúng tôi ít nhất là 1 tấm ảnh của món đồ.';
      } else {
        updatedErrorMessage.itemPhotos = '';
      }
    }

    if(typeCheck == 'itemquantiy'){
      if (!text.trim()) {
        updatedErrorMessage.itemQuantity = 'Số lượng là bắt buộc.';
        setFormData({ ...formData, itemQuantity: ''});
      }
      else if(text > 50 || text < 0){
        updatedErrorMessage.itemQuantity = 'Số lượng món đồ không hợp lệ ( tối đa là 50 )';
        setFormData({ ...formData, itemQuantity: text});
      }
      else {
        updatedErrorMessage.itemQuantity = '';
        setFormData({ ...formData, itemQuantity: text});

      }
    }
    
    if(typeCheck == 'itemtype'){
      if (formData.itemCategory == 'Chọn loại món đồ') {
        updatedErrorMessage.itemCategory = 'Loại món đồ là bắt buộc.';
      } else {
        updatedErrorMessage.itemCategory = '';
      }
    }

    if(typeCheck == 'methodgive'){
      if (text == 'Chọn phương thức cho' && !validAllMethod) {
        updatedErrorMessage.methodGive = 'Vui lòng chọn phương thức cho đồ';
      } else {
        updatedErrorMessage.methodGive = '';
      }
    }
    

    if(typeCheck == 'methodbringitemtowarehouse'){
      // if (formData.methodsBringItemToWarehouse == 'Chọn phương thức mang đồ đến kho' && formData.methodGive == 'Gửi món đồ đên kho') {
      if(!validAllMethod && formData.methodsBringItemToWarehouse == 'Chọn phương thức mang đồ đến kho'){
        updatedErrorMessage.methodsBringItemToWarehouse = 'Vui lòng chọn phương thức đem đồ đến kho';
      } else {
        updatedErrorMessage.methodsBringItemToWarehouse = '';
      }
    }

    if(typeCheck == 'warehouseselect'){
      // if (formData.warehouseAddress == 'Chọn kho' && formData.methodGive == 'Gửi món đồ đên kho' && formData.methodsBringItemToWarehouse == 'Tự đem đến kho') {
      if(!validAllMethod && text == 'Chọn kho'){
        updatedErrorMessage.warehouseAddress = 'Vui lòng chọn kho.';
      } else {
        updatedErrorMessage.warehouseAddress = '';
      }
    }

    setErrorMessage(updatedErrorMessage);
  }


  useEffect( () => {
    if(      
      !errorMessage.itemName && 
      !errorMessage.itemPhotos && 
      !errorMessage.itemQuantity && 
      !errorMessage.itemCategory && 
      !errorMessage.methodGive && 
      !errorMessage.warehouseAddress &&
      formData.itemName && 
      formData.itemPhotos.length > 0 && 
      formData.itemQuantity &&
      formData.itemCategory !== 'Chọn loại món đồ' &&
      formData.methodGive !== 'Chọn phương thức cho' && validAllMethod) {
        setIsValidNext(true)
    }
      else{
        setIsValidNext(false);
      }

  })
  const handleNext = () => {
    if (
      !errorMessage.itemName && 
      !errorMessage.itemPhotos && 
      !errorMessage.itemQuantity && 
      !errorMessage.itemCategory && 
      !errorMessage.methodGive && 
      !errorMessage.warehouseAddress &&
      formData.itemName && 
      formData.itemPhotos.length > 0 && 
      formData.itemQuantity &&
      formData.itemCategory !== 'Chọn loại món đồ' &&
      formData.methodGive !== 'Chọn phương thức cho' && validAllMethod
    ) {
      // if (isWarehouseGive && !errorMessage.methodsBringItemToWarehouse && formData.methodsBringItemToWarehouse !== 'Chọn phương thức mang đồ đến kho') {
      //   if (isBringItemToWarehouse && !errorMessage.warehouseAddress && formData.warehouseAddress !== 'Chọn kho') {
          setStep(2);
        }
      // // } 
      // if (!isWarehouseGive || !isBringItemToWarehouse) {
      //   setStep(2);
      // }
    // }

    // Tiếp tục xử lý submit form ở đây
  };



  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  const handleSelectWarehouse = () => {
    navigation.navigate('MapSelectWarehouseGiveScreen', {
      warehouses: wareHouses,
      setWarehouseSelected: setWarehouseSelected
    })
  }


  return (
    <ScrollView style = {styles.container}>
      <Text style={styles.title}>Thông tin sản phẩm </Text>
      <TextInput
        label="Tên món đồ"
        value={formData.itemName}
        onBlur={() => handleValidate(formData.itemName,'itemname')}
        onChangeText={(text) => {
          handleValidate(text,'itemname');
          // setErrorMessage({...errorMessage, itemName: ''})
        }}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        error={errorMessage.itemName? true : false}
        theme={{
          colors: {
            error: appColors.danger, 
          },
        }}
      />
      {(errorMessage.itemName) && <TextComponent text={errorMessage.itemName}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
      
      <TouchableOpacity onPress={() => handleValidate('','photo')}>
        <TextInput
            label="Ảnh của món đồ"
            style={styles.input}
            underlineColor="transparent" // Màu của gạch chân khi không focus
            editable={false} // Người dùng không thể nhập trực tiếp vào trường này
            error={errorMessage.itemPhotos? true : false}
            // onBlur={() => handleValidate(formData.itemPhotos,'photo')}
            theme={{
              colors: {
                error: appColors.danger, 
              },
            }}
          />
          {/* Hiển thị ảnh đã chọn */}
        <ScrollView horizontal>
            {formData.itemPhotos.map((image: any, index) => (
              <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                  <TouchableOpacity 
                    onPress={() => {
                      removeImage(index);
                      setErrorMessage({...errorMessage, itemPhotos: ''})
                      handleValidate(formData.itemPhotos,'photo');
                    }} 
                    style={styles.closeButton}
                  >
                    <MaterialIcons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
        </ScrollView>

        <Button icon="camera" mode="contained" onPress={pickImage} style={styles.button}>
          Chọn Ảnh
        </Button>
      </TouchableOpacity>

      {(errorMessage.itemPhotos) && <TextComponent text={errorMessage.itemPhotos}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}


      <TextInput
        label="Số lượng"
        value={formData.itemQuantity}
        onBlur={() => handleValidate(formData.itemQuantity,'itemquantiy')}
        onChangeText={(text) => {
          const newText = text.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số
          // setFormData({ ...formData, itemQuantity: newText });
          handleValidate(newText,'itemquantiy');
          if (newText === '') { // Cho phép xoá hết nội dung
            setFormData({ ...formData, itemQuantity: '' });
          }
        }}   
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        keyboardType="numeric" // Chỉ hiển thị bàn phím số
        error={errorMessage.itemQuantity? true : false}
        theme={{
          colors: {
            error: appColors.danger, 
          },
        }}
      />
      {(errorMessage.itemQuantity) && <TextComponent text={errorMessage.itemQuantity}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}


        <Dropdown
          style={[styles.dropdown, isFocusSelectedItemType ? { borderColor: 'blue', borderBottomWidth: 2 } : errorMessage.itemCategory ? {borderColor: appColors.danger, borderBottomWidth: 2} : { borderColor: 'gray'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={itemTypesDropdown}
          // search
          maxHeight={windowHeight*0.2}
          labelField="label"
          valueField="value"
          placeholder={!isFocusSelectedItemType ? '  Chọn loại món đồ' : '...'}
          // searchPlaceholder="Tìm kiếm..."
          value={selectedItemTypeDropdown}
          onFocus={() => {
            setIsFocusSelectedItemType(true);             
            handleValidate('', 'itemtype');
          }}
          onBlur={() => setIsFocusSelectedItemType(false)}
          onChange={item => {
            setFormData({ ...formData, itemCategory: item.value});
            setErrorMessage({...errorMessage, itemCategory: ''})
            // handleValidate(item.value,'itemtype');
            setSelectedItemTypeDropdown(item.value);
            setIsFocusSelectedItemType(false);
          }}

          
        />
      {(errorMessage.itemCategory) && <TextComponent text={errorMessage.itemCategory}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}


    <Dropdown
        style={[styles.dropdown, isFocusMethodGive ? { borderColor: 'blue', borderBottomWidth: 2 } : errorMessage.methodGive ? {borderColor: appColors.danger, borderBottomWidth: 2} : { borderColor: 'gray'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        // inputSearchStyle={styles.inputSearchStyle}

        iconStyle={styles.iconStyle}
        data={methodsGive}
        // search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusMethodGive ? '  Phương thức cho đồ' : '...'}
        searchPlaceholder="Tìm kiếm..."
        value={selectedMethodGive}
        onFocus={() => {
          setIsFocusMethodGive(true);
          handleValidate('', 'methodgive');

        }}
        onBlur={() => setIsFocusMethodGive(false)}
        onChange={item => {
          setSelectedMethodGive(item.value);
          setIsFocusMethodGive(false);
          setFormData({ ...formData, methodGive: item.label.substring(2)});
          // handleValidate('','methodgive') 
          // setErrorMessage({...errorMessage, methodGive: ''})

        }}
        />
      {(errorMessage.methodGive) && <TextComponent text={errorMessage.methodGive}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}


      {isWarehouseGive && (
        <>
          <Dropdown
            style={[styles.dropdown, isFocusBringItemToWarehouse ? { borderColor: 'blue', borderBottomWidth: 2 } : errorMessage.methodsBringItemToWarehouse ? {borderColor: appColors.danger, borderBottomWidth: 2} : { borderColor: 'gray'}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            // inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={methodsBringItemToWarehouse}
            // search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocusBringItemToWarehouse ? '  Phương thức đem đồ đến kho' : '...'}
            // searchPlaceholder="Tìm kiếm..."
            value={bringItemToWarehouseMethodsDropDown}
            onFocus={() => {
              setIsFocusBringItemToWarehouse(true);
              handleValidate(formData.methodsBringItemToWarehouse,'methodbringitemtowarehouse')
            }}
            onBlur={() => setIsFocusBringItemToWarehouse(false)}
            onChange={item => {
              setBringItemToWarehouseMethodDropdown(item.value);
              setIsFocusBringItemToWarehouse(false);
              setFormData({ ...formData, methodsBringItemToWarehouse: item.label.substring(2)})
              setErrorMessage({...errorMessage, methodsBringItemToWarehouse: ''})
            }}

          />
          {(errorMessage.methodsBringItemToWarehouse) && <TextComponent text={errorMessage.methodsBringItemToWarehouse}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
        </>
      )}

      {isBringItemToWarehouse && isWarehouseGive && (
        <>
          <TextInput
            label="Kho"
            value={warehouseSelected ? `${warehouseSelected.warehousename}, ${warehouseSelected.address}`  : ''}
            style={styles.input}
            underlineColor="transparent" // Màu của gạch chân khi không focus
            editable={false} // Người dùng không thể nhập trực tiếp vào trường này
            error={errorMessage.warehouseAddress? true : false}
            // onBlur={() => handleValidate(formData.itemPhotos,'photo')}
            theme={{
              colors: {
                error: appColors.danger, 
              },
            }}
          />
          <Button icon="warehouse" mode="contained" onPress={() => handleSelectWarehouse()} style={styles.button}>
            Chọn kho
          </Button>
          {(errorMessage.warehouseAddress) && <TextComponent text={errorMessage.warehouseAddress}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
        </>
      )}
        <Button mode="contained" onPress={handleNext} disabled={!isValidNext}>Tiếp theo</Button>
      

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
    marginTop: 5,
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
    // marginBottom: 20,
  },
  dropdownText: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    
  },
  inputDropDown: {
    width: '100%',
    // marginBottom: 20,
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
    borderWidth: 0,

  },
  selectedTextStyle: {
    fontSize: 14,
    borderWidth: 0,
    marginRight: 50,
    // backgroundColor: 'blue'

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

export default StepOne;
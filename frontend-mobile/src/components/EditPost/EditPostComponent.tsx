
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';

import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { appColors } from '../../constants/appColors';
import { appInfo } from '../../constants/appInfos';
import { appSizes } from '../../constants/appSizes';
import { fontFamilies } from '../../constants/fontFamilies';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/AntDesign'; // Import Icon
import { ProfileModel } from '../../models/ProfileModel';
import axios from 'axios';
import userAPI from '../../apis/userApi';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import ShowMapComponent from '../ShowMapComponent';
import { UploadImageToAws3 } from '../../ImgPickerAndUpload';
import ContainerComponent from '../ContainerComponent';


interface EditPostComponent  {
  // navigation?: any;
  route?: any;
  title: string;
  titleButton1?: string;
  titleButton2?: string;
  isShowButton1?: boolean;
  isShowButton2?: boolean;
  linkForButton1?: string;
  linkForButton2?: string;
  content?: string
  postID?: number

};

interface PostReceiver {
  receiverid: number;
  receivertypeid: number;
  postid: number;
  avatar: string;
  username: string;
  firstname: string;
  lastname: string;
  comment: string;
  time: Date;
  give_receivetype: string;
  warehouseid?: number;
}

interface Post {
  postid: number; // Do SERIAL tự tăng nên giá trị này sẽ được tự động sinh ra và là duy nhất
  title: string; // VARCHAR(255) và NOT NULL nên đây là một chuỗi không được phép rỗng
  location?: string; // TEXT có thể null
  description?: string; // TEXT có thể null
  owner: number; // INT, tham chiếu đến UserID trong bảng User
  time?: Date; // TIMESTAMP có thể null
  itemid?: number; // INT, tham chiếu đến ItemID trong bảng Item, có thể null
  createdat: Date; // TIMESTAMP NOT NULL, lưu thời gian tạo bản ghi
  timestart?: Date; // DATE có thể null
  timeend?: Date; // DATE có thể null
  longitude?: number;
  latitude?: number;
  givetypeid?: number;
  addressid?: number;
  address?: string;
}


interface Item {
  itemID: number;
  itemName: string;
  itemCategory: string;
  itemQuantity: number;
  // itemDescription: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}


interface ItemImage {
  imgid: string;
  itemid: number;
  path: string;
}



export const EditPostComponent: React.FC<EditPostComponent> = ({ route, title, titleButton1, titleButton2, isShowButton1, isShowButton2, linkForButton1, linkForButton2, postID, content}) => {

  const auth = useSelector(authSelector);

  const navigation: any = useNavigation();

  const [post, setPost] = useState<Post | any>(null); // Sử dụng Post | null để cho phép giá trị null
  const [postReceivers, setPostReceivers] = useState<PostReceiver[]>([]);
  const [profile, setProfile] = useState<ProfileModel>();
  const [itemImages, setItemImages] = useState<ItemImage[]>([]);
  const [itemImagesAdd, setItemImagesAdd] = useState<any[]>([]);
  const [itemImagesDelete, setItemImagesDelete] = useState<any[]>([]);

  const [isDeleteImage, setIsDeleteImage] = useState<any>(false);
  const [isAddImage, setIsAddImage] = useState<any>(false);
  const [newTitle, setNewTitle] = useState<any>(null);
  const [newDescription, setNewDescription] = useState<any>(null);


  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUpdloaded] = useState(false);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [minEndDate, setMinEndDate] = useState<Date>(new Date());

  const [startDate, setStartDate] = useState<Date | any>(null);
  const [endDate, setEndDate] = useState<Date | any>(null);

  const [newStartDate, setNewStartDate] = useState<Date | any>(null);
  const [newEndDate, setNewEndDate] = useState<Date | any>(null);


  const [isUserPost, setIsUserPost] = useState(false);
  const [itemID, setItemID] = useState();
  const [location, setLocation] = useState<any>(null);
  const textInputRef = useRef<any>(null);



  useEffect(() => {
    const fetchAllData = async () => {
      let itemIDs = null;
      let owner = null
      try {
        // console.log(postID);
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/posts/${postID}`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch post details'); // Xử lý lỗi nếu request không thành công
        }
        setPost(res.data.postDetail); // Cập nhật state với dữ liệu nhận được từ API
        setItemID(res.data.postDetail.itemid);
        itemIDs = res.data.postDetail.itemid;
        owner = res.data.postDetail.owner;
        setNewTitle(res.data.postDetail.title);
        setNewDescription(res.data.postDetail.description);

        // console.log(post?.title +  ' ' + res.data.postDetail.latitude);
        setIsUserPost(res.data.postDetail.owner == auth.id);


      } catch (error) {
        console.error('Error fetching post details:', error);
      }

      try {

        const res = await axios.get(`${appInfo.BASE_URL}/posts/postreceivers/${postID}`)
        if (!res) {
          throw new Error('Failed to fetch post receivers'); // Xử lý lỗi nếu request không thành công
        }
        setPostReceivers(res.data.postReceivers); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching post receivers:', error);
      }

      try {

        const res = await axios.get(`${appInfo.BASE_URL}/items/images/${itemIDs}`)
        // const res = await itemsAPI.HandleAuthentication(
        //   `/${itemID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch item details'); // Xử lý lỗi nếu request không thành công
        }
        setItemImages(res.data.itemImages); // Cập nhật state với dữ liệu nhận được từ API
        // setItemID(data.id);
      
      } catch (error) {
        console.error('Error fetching item details:', error);
      }

      try {

        const res = await userAPI.HandleUser(`/get-profile?userId=${owner}`);
        res && res.data && setProfile(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (postID) {
      fetchAllData();
    }

}, []);

useEffect(() => {
  if(itemImagesAdd.length > 0){
    setIsAddImage(true);
  }
  if(itemImagesDelete.length > 0){
    setIsDeleteImage(true);
  }
  if(itemImagesAdd.length == 0){
    setIsAddImage(false);
  }
  if(itemImagesDelete.length == 0){
    setIsDeleteImage(false);
  }
},[itemImagesAdd,itemImagesDelete]);

// useEffect(() =>{
//   if( post.longitude){
//     setLocation({
//       addressid: post.addressid,
//       address: post.address,
//       longitude: parseFloat(post.longitude),
//       // latitude: parseFloat(post.latitude),
//     });
//   }
// },[post])


const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
  const currentDate = selectedDate ? selectedDate : post.timestart;
  setStartDatePickerVisibility(Platform.OS === 'ios');
  setNewStartDate( moment(currentDate).format('YYYY-MM-DD') );
};

const onChangeEndDate = (event: any, selectedDate: Date | undefined) => {
  const currentDate = selectedDate ? selectedDate : newEndDate;
  setEndDatePickerVisibility(Platform.OS === 'ios');
  setNewEndDate( moment(currentDate).format('YYYY-MM-DD') ); // Cập nhật formData
  
};

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const handleBlur = () => {
    // Khi mất focus, reset giá trị của TextInput
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({ selection: { start: 0, end: 0 } });
    }
  };

  const removeImage = (index: number) => {
    const updatedPhotos = [...itemImages];
    if(updatedPhotos[index].imgid){
      setItemImagesDelete( [...itemImagesDelete, itemImages[index]] ); // Cập nhật đường dẫn của các ảnh vào formData
      console.log('XÓA ẢNHHHHHHH',itemImages[index]);
    }
    if(!updatedPhotos[index].imgid){
      for( let i=0; i < itemImagesAdd.length; i++){
        if(itemImagesAdd[i].path === updatedPhotos[index].path){
          const deleteImgFromImagesAdd = itemImagesAdd;
          deleteImgFromImagesAdd.splice(i,1);
          setItemImagesAdd(deleteImgFromImagesAdd);
        }
      }
    }
    console.log('Addddd IMGGGGG', isAddImage);
    updatedPhotos.splice(index, 1);
    setItemImages(updatedPhotos);
  };

  let tempTitle: string = newTitle;
  let tempDescription: any = newDescription;
  let tempStartdate: any = new Date(newStartDate);
  let tempEnddate: any = new Date(newEndDate);
  let tempLocation: any = location;

  const handleEdit = async () =>{
    if(!newTitle){
      if(!newTitle.trim()){
        tempTitle = post.title;
        setNewTitle(post.title);
      }
    }

    if(!newDescription){
      if(!newDescription.trim()){
        tempDescription = post.description;
        setNewDescription(post.description);
      }
    }


    if(!newStartDate){
      tempStartdate = new Date(post.timestart);
      setNewStartDate(new Date(post.timestart));
    }
    if(!newEndDate){
      tempEnddate = new Date(post.timeend);
      setNewEndDate(new Date(post.timeend));
    }
    if(newStartDate){
      setNewStartDate(new Date(newStartDate));
    }
    if(newEndDate){
      setNewEndDate(new Date(newEndDate));
    }
    if(!location){
      tempLocation = {...location, address: post.address, longitude: post.longitude, latitude: post.latitude};
      setLocation({...location, address: post.address, longitude: post.longitude, latitude: post.latitude})
    }


    console.log('THISS ISSS ADDDRESSSSS', itemImagesAdd);

    try{
    const res = await axios.post(`${appInfo.BASE_URL}/posts/editPost`, {
      postid: post.postid,
      // isAddImage: isAddImage,
      isDeleteImage: isDeleteImage,
      newTitle: tempTitle,
      newDescription: tempDescription,
      newLocation: tempLocation,
      newStartDate: tempStartdate,
      newEndDate: tempEnddate,
      // imageAddArray: data,
      imageDeleteArray: itemImagesDelete,
      // itemid: post.itemid,
      addressid: post.addressid,
    })

    if(isAddImage){
      try{
        itemImagesAdd.map(async (image) => {
          const imgTemp = {uri: image.path, name: image.name, type: image.type};
          const data = await UploadImageToAws3(imgTemp);
          
          const responseUploadImage = await axios.post(`${appInfo.BASE_URL}/items/upload-image`,{
            path: data.url,
            itemID: itemID
          })
  
          console.log(responseUploadImage)
        })
        
      } catch (error) {
        console.log(error)
      }
    }
    console.log(res.data.postUpdated);
    Alert.alert('Success', 'Cập nhật post thành công');

    navigation.navigate('PostScreen');
      } catch(error){
    console.error('Lỗi cập nhật:', error);
    }
  }

  const handleCancel = () =>{
    navigation.goBack();
  }

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
      const imageData: any = pickerResult.assets.map((asset: any) => {
        return {
          path: asset.uri,
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

      setItemImages( [...itemImages, ...imageData] ); // Cập nhật đường dẫn của các ảnh vào formData
      setItemImagesAdd( [...itemImagesAdd, ...imageData] ); // Cập nhật đường dẫn của các ảnh vào formData
      console.log('Addddd IMGGGGG', itemImagesAdd);
    }
  };



  return(
    <ContainerComponent back title="Chỉnh sửa bài viết">

      <ScrollView style={styles.container}>

      <View >
          <TextInput
              label="Ảnh của món đồ"
              style={styles.input}
              underlineColor="transparent" // Màu của gạch chân khi không focus
              editable={false} // Người dùng không thể nhập trực tiếp vào trường này
              error={false}
              // onBlur={() => handleValidate(formData.itemPhotos,'photo')}
              theme={{
                colors: {
                  error: appColors.danger, 
                },
              }}
            />
            {/* Hiển thị ảnh đã chọn */}
          <ScrollView horizontal>
              {itemImages.map((image: any, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image.path }} style={styles.image} />
                    {itemImages.length > 1 && 
                        <TouchableOpacity 
                          onPress={() => {
                            removeImage(index);
                          }} 
                          style={styles.closeButton}>
                          <MaterialIcons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    }
                    
                  </View>
                ))}
          </ScrollView>

          <Button icon="camera" mode="contained" onPress={pickImage} style={styles.button}>
            Thêm Ảnh
          </Button>
        </View>

        {/* <TextInput
          label="Tên món đồ"
          value={post.name ? post.name : ''}
          // onBlur={() => handleValidate(formData.itemName,'itemname')}
          onChangeText={(text) => {
            // handleValidate(text,'itemname');
            // setErrorMessage({...errorMessage, itemName: ''})
          }}
          style={styles.input}
          underlineColor="gray" // Màu của gạch chân khi không focus
          activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
          error={false}
          theme={{
            colors: {
              error: appColors.danger, 
            },
          }}
        /> */}

        {post &&
          <>
            <TextInput
              label="Tiêu đề bài đăng"
              value={newTitle}
              // onBlur={() => handleValidate(formData.postTitle,'postitle')}
              onChangeText={(text) => {
                setNewTitle(text);
              }}
              style={styles.input}
              underlineColor="gray" // Màu của gạch chân khi không focus
              activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
              // error={errorMessage.postTitle? true : false}
              theme={{
                colors: {
                  error: appColors.danger, 
                },
              }}
            />

            <TextInput
              label="Nội dung của bài đăng"
              value={newDescription}
              // onBlur={() => handleValidate(formData.postDescription,'postdescription')}
              onChangeText={(text) => {
                // setFormData({ ...formData, postDescription: text });
                setNewDescription(text);
                // setErrorMessage({...errorMessage, postDescription: ''});
                // handleValidate(text,'postdescription');

              }}
              style={styles.input}
              underlineColor="gray" // Màu của gạch chân khi không focus
              activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
              multiline={true} // Cho phép nhập nhiều dòng văn bản
              numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
              // error={errorMessage.postDescription? true : false}
              theme={{
                colors: {
                  error: appColors.danger, 
                },
              }}
              />

            <TouchableOpacity onPress={showStartDatePicker}>
              <TextInput
                label="Ngày bắt đầu"
                value={newStartDate ? moment(newStartDate).format('YYYY-MM-DD') : moment(post.timestart).format('YYYY-MM-DD')} // Hiển thị ngày được chọn dưới dạng YYYY-MM-DD
                style={styles.input}
                editable={false} // Người dùng không thể chỉnh sửa trực tiếp
                error={false}
                theme={{
                  colors: {
                    error: appColors.danger, 
                  },
                }}
              />

            </TouchableOpacity>
              {isStartDatePickerVisible && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={newStartDate ?  moment(newStartDate).toDate() :  moment(post.timestart).toDate()} // Hiển thị ngày được chọn dưới dạng YYYY-MM-DD
                  mode="date"
                  is24Hour={true}
                  display="default"
                  minimumDate={new Date} // Đặt ngày tối thiểu có thể chọn cho DatePicker
                  maximumDate={newEndDate ? moment(newEndDate).toDate() : post.timeend ? moment(post.timeend).toDate() : moment().add(2, 'months').toDate()} // Đặt ngày tối đa có thể chọn cho DatePicker
                  onChange={onChangeStartDate}
                />
              )}

              <TouchableOpacity onPress={showEndDatePicker}>
                <TextInput
                  label="Ngày kết thúc"
                  value={newEndDate ? moment(newEndDate).format('YYYY-MM-DD')  : post.timeend ? moment(post.timeend).format('YYYY-MM-DD') : ''} // Hiển thị ngày được chọn dưới dạng YYYY-MM-DD
                  // onBlur={() => handleValidate(formData.postEndDate,'postenddate')}
                  style={styles.input}
                  editable={false} // Người dùng không thể chỉnh sửa trực tiếp
                  error={false}
                  theme={{
                    colors: {
                      error: appColors.danger, 
                    },
                  }}
                />      
              </TouchableOpacity>
                {isEndDatePickerVisible && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={newEndDate ? moment(newEndDate).toDate() : post.timeend ? moment(post.timeend).toDate() : new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    minimumDate={newStartDate ?  moment(newStartDate).toDate() :  moment(post.timestart).toDate()} // Đặt ngày tối thiểu có thể chọn cho DatePicker
                    maximumDate={newStartDate ? moment(post.timestart).add(2, 'months').toDate() : moment(post.timestart).add(2, 'months').toDate()} // Đặt ngày tối đa có thể chọn cho DatePicker
                    onChange={onChangeEndDate}
                  />
                )}
                {post && post.givetypeid !== 3 && (
                  <>
                  <TextInput
                    label="Địa chỉ"
                    value={(location ? location.address : post?.address)} // Hiển thị 10 ký tự đầu tiên
                    style={styles.input}
                    editable={true} // Người dùng không thể chỉnh sửa trực tiếp
                    error={false}
                    onBlur={() => {
                      // handleValidate('', 'postaddress');
                      handleBlur();
                    }}
                    theme={{
                      colors: {
                        error: appColors.danger, 
                      },
                    }}
                    disabled={true}
                    selection={{start: 0, end: 0}}
                  />
                  <ShowMapComponent
                    location={location ? location : {address: post?.address, longitude: parseFloat(post?.longitude), latitude: parseFloat( post?.latitude)}}
                    setLocation={setLocation}
                    useTo={'setPostAddress'}
                  />
                  </>
                )}

              <Button mode="contained" onPress={handleEdit} style={styles.button} >Lưu</Button>
              <Button  onPress={handleCancel} style={styles.cancelButton} >Hủy</Button>


          </>
        }

        
      </ScrollView>
    </ContainerComponent>

  )

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: appColors.white,
    // flexDirection: 'column',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-around'
    
  },

  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    fontSize: 14,
  },

  animation:{
    height: '100%',
    width: '100%'

  },
  title: {
    marginBottom: 20,
    color: appColors.black,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
    fontSize: 25,
    fontStyle: 'italic'
  },

  textContent: {
    color: appColors.black,
    fontFamily: fontFamilies.bold,
    fontSize: appSizes.android.title,
    textAlign: 'center',

  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },

  buttonStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Chỉ định màu nền của nút
    borderRadius: 10,
    margin: '3%',
    marginLeft: '4%',
    width: appInfo.sizes.WIDTH * 0.38,
    height: appInfo.sizes.WIDTH * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

  },

  button: {
    marginTop: 20,
    marginBottom: 10,
  },

  cancelButton: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: appColors.gray5,
    color: appColors.black
  },

  homeButton:{
    backgroundColor: appColors.black, // Chỉ định màu nền của nút
    padding: 10,
    borderRadius: 10,
    // marginTop: '20%',
    // position: 'absolute'

  },
  textStyle: {
    color: appColors.black, // Chỉ định màu chữ
    textAlign: 'center',
    fontSize: appSizes.android.default,
    fontFamily: fontFamilies.bold,   
    // textDecorationLine: 'underline'
  },

  icon: {
    // marginHorizontal: 5, // Khoảng cách giữa biểu tượng và văn bản
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

})

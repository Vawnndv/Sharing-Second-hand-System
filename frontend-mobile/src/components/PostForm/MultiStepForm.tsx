import React, { useState } from 'react';
import StepOne from './PostItemFormStepOne';
import StepTwo from './PostItemFormStepTwo';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import itemsAPI from '../../apis/itemApi'




interface FormDataStepOne {
  itemName: string;
  itemPhotos: string[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc
  itemCategory: string;
  itemQuantity: string;
  itemDescription: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}


interface FormDataStepTwo {
  postTitle: string;
  postDescription: string;
  postStartDate: string;
  postEndDate: string;
  postPhoneNumber: string
  postAddress: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataStepOne, setFormDataStepOne] = useState<FormDataStepOne>({ itemName: '', itemPhotos: [], itemCategory: '', itemQuantity: '', itemDescription: '' });
  const [formDataStepTwo, setFormDataStepTwo] = useState<FormDataStepTwo>({ postTitle: '', postDescription: '', postStartDate: '', postEndDate: '', postPhoneNumber: '', postAddress: ''  /* khởi tạo các trường khác */ });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne setStep={setCurrentStep} formData={formDataStepOne} setFormData={setFormDataStepOne} />;
      case 2:
        return <StepTwo setStep={setCurrentStep} formData={formDataStepTwo} setFormData={setFormDataStepTwo} />;
      // Có thể thêm các case khác cho các bước tiếp theo
      default:
        return null;
    }
  };


  const createItem = async (name: string, quantity: number, itemtypeID: number) => {
    try {
      const res = await itemsAPI.HandleAuthentication(
        '/',
        {name, quantity, itemtypeID},
        'post'
      );
      console.log(res.data);
      Alert.alert('Success', 'Item created successfully');

    } catch (error) {
      console.log(error);
    }
  };


const createPost = async (title: string, location: string, description: string, owner: number, time: Date, itemid : number, timestart: Date, timeend: Date) => {
  try {
    const res = await itemsAPI.HandleAuthentication(
      '/createPost',
      {title, location, description, owner, time, itemid, timestart, timeend},
      'post'
    );
    console.log(res.data);
    Alert.alert('Success', 'Post created successfully');

  } catch (error) {
    console.log(error);
  }
};


  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    if (!formDataStepTwo.postTitle.trim()) {
      alert('Tiêu đề bài đăng là bắt buộc.');
      return;
    }
    if (!formDataStepTwo.postDescription.trim()) {
      alert('Nội dung của bài đăng là bắt buộc.');
      return;
    }
    if (!formDataStepTwo.postStartDate.trim()) {
      alert('Ngày bắt đầu là bắt buộc.');
      return;
    }

    if (!formDataStepTwo.postEndDate.trim()) {
      alert('Ngày kết thúc là bắt buộc.');
      return;
    }
    
    if (!formDataStepTwo.postPhoneNumber.trim()) {
      alert('Số điện thoại là bắt buộc.');
      return;
    }

    if (!formDataStepTwo.postAddress.trim()) {
      alert('Số điện thoại là bắt buộc.');
      return;
    }

    try {
      // Tạo item đầu tiên
      const newItemRes = await createItem(
        formDataStepOne.itemName,
        parseInt(formDataStepOne.itemQuantity),
        parseInt(formDataStepOne.itemCategory),
      );

      if (newItemRes != null &&  'data' in newItemRes) {
        const newItemID = (newItemRes as any)?.data?.itemid;
        // Đảm bảo rằng itemID được trả về từ API là chính xác

        const values : any = [formDataStepTwo.postTitle, formDataStepTwo.postAddress, formDataStepTwo.postDescription, 1, new Date(),  newItemID, new Date(formDataStepTwo.postStartDate), new Date(formDataStepTwo.postEndDate)];
        const newPostRes = await createPost(
          formDataStepTwo.postTitle,
          formDataStepTwo.postAddress,
          formDataStepTwo.postDescription,
          1, // Thay thế số người dùng bằng user ID thực tế nếu có
          new Date(),
          newItemID,
          new Date(formDataStepTwo.postStartDate),
          new Date(formDataStepTwo.postEndDate)
        );
        console.log(newPostRes);
        if (newPostRes != null) {
          // Thực hiện các hành động khác sau khi tạo thành công
          Alert.alert('Success', 'Item and Post created successfully');
        }
        } else {
          // Xử lý khi tạo item thất bại
          Alert.alert('Error', 'Failed to create item');
        }
      } catch (error) {
        console.error('Error creating item and post:', error);
        Alert.alert('Error', 'Failed to create item and post. Please try again later.');
      }      
  };


  return (
    <ScrollView>
      <View style={styles.screenContainer}>
        <ScrollView  style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>GIVE AWAY YOUR ITEM</Text>
            {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
              <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
            </TouchableOpacity>
          )}
        </View>
          {renderStep()}
          {currentStep === 2 && (
            <Button style= {styles.button} mode="contained" onPress={handleSubmit}>Submit</Button> // Sửa lại để thực hiện submit thực tế
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  screenContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    paddingHorizontal: 10,
  },

  container: {
    width: '95%'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center', // Thêm vào để căn giữa tiêu đề theo chiều ngang
    alignSelf: 'center', // Đảm bảo Text căn giữa trong View cha nếu cần
    width: '100%', // Đảm bảo Text có chiều rộng đủ để căn giữa đúng cách
    padding: 20,
    paddingTop: 50,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 30,

  },
});


export default MultiStepForm;
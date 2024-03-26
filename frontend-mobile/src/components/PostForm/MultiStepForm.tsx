import React, { useState } from 'react';
import StepOne from './PostItemFormStepOne';
import StepTwo from './PostItemFormStepTwo';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';



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


  const handleSubmit = () => {
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
  
    // Tiếp tục xử lý submit form ở đây
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView  style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.title}>GIVE AWAY YOUR ITEM</Text>
        </View>
        {renderStep()}
        {currentStep > 1 && (
            <Button style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
              <MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />
            </Button>
          )}
        {currentStep === 2 && (
          <Button style= {styles.button} mode="contained" onPress={handleSubmit}>Submit</Button> // Sửa lại để thực hiện submit thực tế
        )}
      </ScrollView>
    </View>
  );

};

const styles = StyleSheet.create({

  screenContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 1,
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
  },
});


export default MultiStepForm;
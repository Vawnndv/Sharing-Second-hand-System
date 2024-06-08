
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';

import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { appColors } from '../constants/appColors';
import { appInfo } from '../constants/appInfos';
import { appSizes } from '../constants/appSizes';
import { fontFamilies } from '../constants/fontFamilies';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/AntDesign'; // Import Icon


interface ThankYouProps  {
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


export const ThankYou: React.FC<ThankYouProps> = ({ route, title, titleButton1, titleButton2, isShowButton1, isShowButton2, linkForButton1, linkForButton2, postID, content}) => {

  const auth = useSelector(authSelector);

  const navigation: any = useNavigation();


  const goToPostDetail = () => {
    navigation.navigate('ItemDetailScreen', {
      postID: postID,
    })
  }


  const goToOrderScreen = () => {
    navigation.navigate('MyOrder',{screen: 'MyOrder'})
  }


  const goToHomeScreen = () => {
    navigation.navigate('HomeScreen')
  }
  return(
    <View style={styles.container}>

      <LottieView source={require('../../assets/Animation - 1715742581201.json')} style={{width: appInfo.sizes.WIDTH * 1.2 , height: appInfo.sizes.HEIGHT * 0.38}} autoPlay loop />
      {/* <LottieView source={require('../../assets/Animation - 1715742581201.json')} style={{width: appInfo.sizes.WIDTH , height: appInfo.sizes.HEIGHT * 0.38}} autoPlay loop /> */}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.textContent}>{content}</Text>

      <View style={styles.buttonContainer}>

        <TouchableOpacity onPress={goToHomeScreen} style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Trang chủ</Text>
          <Icon name="right" size={18} color="white" style={styles.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToPostDetail} style={styles.buttonStyle}>
          <Icon name="left" size={18} color="white" style={styles.icon} />
          <Text style={styles.textStyle}>Bài đăng</Text>
        </TouchableOpacity>

      </View>

      

      

      {/* <TouchableOpacity onPress={goToHomeScreen} style={styles.homeButton}>
        <Text style={styles.textStyle}>Về trang chủ </Text>
      </TouchableOpacity> */}
    </View>
    
  )

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: appColors.purple,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
    
  },

  animation:{
    height: '100%',
    width: '100%'

  },
  title: {
    marginBottom: 20,
    color: appColors.white,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
    fontSize: 25,
    fontStyle: 'italic'
  },

  textContent: {
    color: appColors.white,
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

  homeButton:{
    backgroundColor: appColors.purple, // Chỉ định màu nền của nút
    padding: 10,
    borderRadius: 10,
    // marginTop: '20%',
    // position: 'absolute'

  },
  textStyle: {
    color: appColors.white, // Chỉ định màu chữ
    textAlign: 'center',
    fontSize: appSizes.android.default,
    fontFamily: fontFamilies.bold,   
    // textDecorationLine: 'underline'
  },

  icon: {
    // marginHorizontal: 5, // Khoảng cách giữa biểu tượng và văn bản
  },
})

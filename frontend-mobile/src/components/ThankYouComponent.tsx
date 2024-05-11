
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
      postId: postID,
    })
  }


  const goToOrderScreen = () => {
    navigation.navigate('MyOrder',{screen: 'MyOrder'})
  }


  const goToHomeScreen = () => {
    navigation.navigate('Home', {screen: 'HomeScreen'})
  }
  return(
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.textContent}>{content}</Text>

      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={goToPostDetail} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Đi đến bài đăng</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToOrderScreen} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Đi đến trang đơn hàng</Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={goToHomeScreen} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>Về trang chủ </Text>
      </TouchableOpacity>
    </View>
    
  )

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  title: {
    marginBottom: 40,
    color: appColors.black,
    fontFamily: fontFamilies.bold,
    fontSize: 50
  },

  textContent: {
    color: appColors.black,
    fontFamily: fontFamilies.bold,
    fontSize: appSizes.android.title
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },

  buttonStyle: {
    backgroundColor: appColors.purple, // Chỉ định màu nền của nút
    borderRadius: 10,
    margin: '2%',
    width: appInfo.sizes.WIDTH * 0.42,
    height: appInfo.sizes.WIDTH * 0.12,
    alignItems: 'center',
    justifyContent: 'center'

  },

  // homeButton:{
  //   backgroundColor: appColors.purple, // Chỉ định màu nền của nút
  //   padding: 10,
  //   borderRadius: 10,
  //   // marginTop: '20%',
  //   // position: 'absolute'

  // },
  textStyle: {
    color: appColors.white, // Chỉ định màu chữ
    textAlign: 'center',
    fontSize: appSizes.android.default,
    fontFamily: fontFamilies.bold
  }
})

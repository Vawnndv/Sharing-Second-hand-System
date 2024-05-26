import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { ContainerComponent } from '../../components'
import CardPostView from './CardPostView';
import { AntDesign } from '@expo/vector-icons';
import { appColors } from '../../constants/appColors';
import { Button } from 'react-native-paper';
import orderAPI from '../../apis/orderApi';
import postsAPI from '../../apis/postApi';
import { statusOrder } from '../../constants/statusOrder';

const size = 24;
const color = appColors.gray;

const ViewPostManagement = ({navigation, route}: any) => {
  const {title, location, givetype, statusname, image, postid} = route.params;
  
  const cancelGivePost = async () => {
    try {
      const res = await postsAPI.HandlePost(
        `/update-post-status`,
        {
          postid: postid,
          status: statusOrder.CANCELED.statusid
        },
        'post'
      );
      
      navigation.navigate('MyPost', { reload: true })
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelPress = () => {
    cancelGivePost()
  };

  return (
    <ContainerComponent back title="Bài Đăng">
      <View style={{ flex: 1 }}>
        <CardPostView
          navigation={navigation}
          title={title}
          location={location}
          givetype={givetype}
          statusname={statusname}
          image={image}
          postid={postid}
        />
        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <View style={{ flexDirection: 'row' }}>
            <AntDesign name="edit" size={size} color={color} />
            <Text style={styles.text}>Edit</Text>
          </View>
          <AntDesign name="right" size={size} color={appColors.black} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.button}>
          <View style={{ flexDirection: 'row' }}>
            <AntDesign name="eye" size={size} color={color} />
            <Text style={styles.text}>View detail</Text>
          </View>
          <AntDesign name="right" size={size} color={appColors.black} />
        </TouchableOpacity>
        <View style={{marginVertical: 10, display: 'flex', alignItems: 'center'}}>
          <Button mode="contained" onPress={() => handleCancelPress()} buttonColor={appColors.danger} style={{width: '40%'}}>
            Hủy cho
          </Button>
        </View>
      </View>
    </ContainerComponent>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10, // Added padding for better touchable area
    borderRadius: 5, // Optional: makes the touchable area rounded
    display: 'flex',
    justifyContent: 'space-between'
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default ViewPostManagement
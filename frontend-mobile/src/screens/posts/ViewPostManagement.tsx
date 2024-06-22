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
          statusid: statusOrder.CANCELED.statusid
        },
        'post'
      );
      
      navigation.navigate('PostScreen')
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPost  = () => {
    navigation.navigate('EditPostScreen', {
      title: 'Gửi bài viết thành công!!',
      postID: postid,
      content: 'Cảm ơn bạn rất nhiều vì đã cho món đồ, bài viết của bạn sẽ sớm được đội ngũ cộng tác viết kiểm duyệt',
    })
  };


  const handleViewPostDetail  = () => {
    navigation.navigate('ItemDetailScreen', {
      postID: postid,
    })
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
        {statusname === 'Chờ xét duyệt' && (
          <TouchableOpacity onPress={() => {handleEditPost()}} style={styles.button}>
            <View style={{ flexDirection: 'row' }}>
              <AntDesign name="edit" size={size} color={color} />
              <Text style={styles.text}>Chỉnh sửa</Text>
            </View>
            <AntDesign name="right" size={size} color={appColors.black} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => {handleViewPostDetail()}} style={styles.button}>
          <View style={{ flexDirection: 'row' }}>
            <AntDesign name="eye" size={size} color={color} />
            <Text style={styles.text}>Xem chi tiết bài đăng</Text>
          </View>
          <AntDesign name="right" size={size} color={appColors.black} />
        </TouchableOpacity>
        {statusname === 'Chờ xét duyệt' && (
        <View style={{marginVertical: 10, display: 'flex', alignItems: 'center'}}>
          <Button mode="contained" onPress={() => handleCancelPress()} buttonColor={appColors.danger} style={{width: '40%'}}>
            Hủy cho
          </Button>
        </View>
        )}
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
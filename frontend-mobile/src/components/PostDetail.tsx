import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Text, Image, ScrollView, Modal, TouchableOpacity, ActivityIndicator  } from 'react-native';
import { StringLiteral } from 'typescript';
import { AntDesign, SimpleLineIcons  } from '@expo/vector-icons';

import moment from 'moment';
import { appInfo } from '../constants/appInfos';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';
import userAPI from '../apis/userApi';
import { ProfileModel } from '../models/ProfileModel';
import AvatarComponent from './AvatarComponent';




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

interface PostDetailProps {
  postID: number;
}

interface PostReceiver {
  receiverid: number;
  postid: number;
  avatar: string;
  username: string;
  firstname: string;
  lastname: string;
  comment: string;
  time: Date;
  give_receivetype: string;
}



const PostDetail: React.FC<PostDetailProps> = ( {postID} ) =>{
  // const  Avatar = sampleUserOwner.Avatar;
  const [post, setPost] = useState<Post | any>(null); // Sử dụng Post | null để cho phép giá trị null
  const [postReceivers, setPostReceivers] = useState<PostReceiver[]>([]);
  const [profile, setProfile] = useState<ProfileModel>();
  const [itemImages, setItemImages] = useState<ItemImage[]>([]);
  const [itemDetails, setItemDetails] = useState<Item | any>(null);
  const [isLoading, setIsLoading] = useState(false);



  const [isUserPost, setIsUserPost] = useState(false);
  const [itemID, setItemID] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const auth = useSelector(authSelector);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        console.log(postID);
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/posts/${postID}`)
        // const res = await postsApi.HandleAuthentication(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch post details'); // Xử lý lỗi nếu request không thành công
        }
        setPost(res.data.postDetail); // Cập nhật state với dữ liệu nhận được từ API
        setItemID(res.data.postDetail.itemid);
        setIsUserPost(res.data.postDetail.owner == auth.id);
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPostReceivers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/posts/postreceivers/${post.postid}`)
        if (!res) {
          throw new Error('Failed to fetch post details'); // Xử lý lỗi nếu request không thành công
        }
        setPostReceivers(res.data.postReceivers); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // const fetchItemDetails = async () => {
    //   try {
    //     if(!itemID){
    //       return;
    //     }
    //     else{
    //       setIsLoading(true);
    //       const res = await axios.get(`${appInfo.BASE_URL}/items/${itemID}`)
    //       // const res = await itemsAPI.HandleAuthentication(
    //       //   `/${itemID}`,
    //       // );
    //       if (!res) {
    //         throw new Error('Failed to fetch item details'); // Xử lý lỗi nếu request không thành công
    //       }
    //       setItemDetails(res.data.item); // Cập nhật state với dữ liệu nhận được từ API
    //       // setItemID(data.id);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching item details:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
  
    const fetchItemImages = async () => {
      try {
        if(!itemID){
          return;
        }
        else{
          setIsLoading(true);
          const res = await axios.get(`${appInfo.BASE_URL}/items/images/${itemID}`)
          // const res = await itemsAPI.HandleAuthentication(
          //   `/${itemID}`,
          // );
          if (!res) {
            throw new Error('Failed to fetch item details'); // Xử lý lỗi nếu request không thành công
          }
          setItemImages(res.data.itemImages); // Cập nhật state với dữ liệu nhận được từ API
          // setItemID(data.id);
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await userAPI.HandleUser(`/profile?userId=${post.owner}`);
        res && res.data && setProfile(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (postID) {
      fetchPostDetails();
      fetchItemImages();
      fetchPostReceivers();
    }
    if (auth) {
      fetchProfile();   
    };

    // fetchItemDetails();
}, [])


  // Nếu postDetails vẫn là null ở đây, bạn có thể hiển thị thông báo lỗi hoặc trạng thái trống
  if (!post || !postReceivers || !itemImages || !profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No data found</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if(post && postReceivers && itemImages && profile){
    return(
      <ScrollView>
        <View style={styles.screenContainer}>
          <View style={styles.container}>
            {modalVisible && (
            <View style={styles.overlayContainer} />
            )}
            <View style={styles.postContainer}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                    <Text >X</Text>
                  </TouchableOpacity>
                  <ScrollView>
                    <Text style={styles.title}>Chọn người bạn muốn cho </Text>
                    {postReceivers.map((postReceiver, index) => {
                      return (
                        <View style={styles.receiverModalContainer} key={index}>
                          <View style={styles.userInfo}>
                            <AvatarComponent 
                              avatar={postReceiver?.avatar}
                              username={postReceiver?.username ? postReceiver?.username : postReceiver?.firstname ? postReceiver?.firstname : ' '}
                              styles={styles.avatar}
                            />                          
                            <View style={styles.receiverInfo}>
                              <Text style={styles.username}>{postReceiver?.firstname ? postReceiver.lastname ? postReceiver.firstname + ' ' + postReceiver.lastname : postReceiver.username : postReceiver.username}</Text>
                              <Text style={styles.receiverType}>{postReceiver.give_receivetype}</Text>
                            </View>
                            {isUserPost && (
                              <Button style={styles.button} onPress={() => {}} mode="contained">Give</Button>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </Modal>

              <View style={styles.userContainer}>
                {/* Hiển thị avatar của user */}
                <AvatarComponent 
                  avatar={profile?.avatar}
                  username={profile?.username ? profile?.username : profile?.email ? profile?.email : ' '}
                  styles={styles.avatar}
                />
                <View style={styles.username_timeContaner}>
                {/* Hiển thị tên của user */}
                  <Text style={styles.username}>{profile?.firstname ? profile.lastname ? profile.firstname + ' ' + profile.lastname : profile.username : profile.username}</Text>

                  {/* Hiển thị ngày đăng */}
                  <View style={styles.timeContainer}>
                    <SimpleLineIcons name="clock" size={20} color="black" />
                    <Text style={{marginLeft: 5}}>{moment(post.time).format('DD-MM-YYYY')}</Text>
                  </View>
                </View>

                {isUserPost && (
                  <Button style={styles.button} onPress={() => setModalVisible(true)} mode="contained">Give</Button>
                )}
                {/* Nút chỉ hiển thị khi isUserPost là false */}
                {!isUserPost && (
                  <Button style={styles.button} onPress={() => {/* Xử lý khi nút được nhấn */}} mode="contained">Receive</Button>
                )}
                </View>
              {/* Hiển thị tiêu đề bài đăng */}
              <Text style={styles.title}>{post.title}</Text>

              {/* Hiển thị mô tả bài đăng */}
              <Text style={styles.description}>{post.description}</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {itemImages?.map((itemImage, index) => (
                  <Image key={index} source={{ uri: itemImage.path }} style={styles.itemPhoto} />
                ))}
              </ScrollView>
            </View>
            <View style={styles.like_receiver_CountContainer}>
              <AntDesign name="inbox" size={24} color="black" />
              <Text style={styles.receiverCount}>Receivers: {postReceivers.length}</Text>
              <AntDesign name="hearto" size={24} color="black" />
              <Text style={styles.loverCount}>Loves: 10</Text>

            </View>
            <ScrollView>
              {postReceivers.map((postReceiver, index) => {
                if(postReceiver.receiverid == auth.id || auth.id == post.owner){
                return (
                  <View style={styles.receiverContainer}>
                    <View style={styles.userInfo}>
                      <AvatarComponent 
                        avatar={postReceiver?.avatar}
                        username={postReceiver?.username ? postReceiver?.username : postReceiver?.firstname ? postReceiver?.firstname : ' '}
                        styles={styles.avatar}
                      />  
                      <View style={styles.receiverInfo}>
                        <Text style={styles.username}>{postReceiver?.firstname ? postReceiver.lastname ? postReceiver.firstname + ' ' + postReceiver.lastname : postReceiver.username : postReceiver.username}</Text>
                        <Text style={styles.receiverType}>{postReceiver.give_receivetype}</Text>
                      </View>
                      {isUserPost && (
                        <Button style={styles.button} onPress={() => {/* Xử lý khi nút được nhấn */}} mode="contained">Give</Button>
                      )}
                    </View>
                    <Text style={styles.comment}>{postReceiver.comment}</Text>
                </View>
                );
              }})}
          </ScrollView>
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default PostDetail;

const styles = StyleSheet.create({

  screenContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },

  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu mờ với opacity là 0.5
    zIndex: 1, // Đảm bảo overlay được đặt trên mọi thành phần khác
  },
  container: {
    marginTop: 20,
    backgroundColor: 'white',
    width: '90%',
  },
  userContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  avatar: {
    width: 45, // Giả sử kích thước bạn muốn
    height: 45, // Giả sử kích thước bạn muốn
    borderRadius: 50, // Để làm tròn hình ảnh
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'

  },
  username: {
    fontWeight: 'bold',
    alignItems: 'center', // Thêm thuộc tính này
  },
  description: {
    marginBottom: 5,
  },
  postContainer: {
    padding: 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 5,
  },

  receiverContainer: {
    flexDirection: 'column', // Sắp xếp các phần tử theo chiều ngang
    // alignItems: 'center', // Căn chỉnh các phần tử theo chiều dọc
    margin: 10,
    padding: 10,
    backgroundColor: 'rgb(240, 240, 240)',
    borderRadius: 6,
  },

  itemPhoto: {
    width: 100,
    height: 100, // Điều chỉnh kích thước của ảnh theo ý muốn
    margin: 5,
    borderRadius: 10,
  },

  comment: {
    fontStyle: 'italic', // Nghiêng chữ
    marginTop: 20,
  },

  like_receiver_CountContainer: {
    fontWeight: 'bold',
    padding: 15,
    flexDirection: 'row',
    backgroundColor: 'rgb(240, 240, 240)',
    width: '100%',
    justifyContent: 'flex-end', // Đảm bảo các phần tử nằm ở cuối container
    marginBottom: 15,
  },

  receiverCount: {
    marginRight: 10,
    marginLeft: 5,
  },

  loverCount: {
    marginLeft: 5,
    marginRight: 10,
  },

  button: {
    marginLeft: 'auto', // Đặt số lượng receiver ở bên phải
    marginTop: 5
  },

  receiverModalContainer: {
    flexDirection: 'column', // Sắp xếp các phần tử theo chiều ngang
    // alignItems: 'center', // Căn chỉnh các phần tử theo chiều dọc
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgb(240, 240, 240)',
    marginTop: 25,
    justifyContent: 'center',
  },

  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20, // Điều chỉnh khoảng cách hai bên modal
    borderRadius: 10,
    padding: 10,
    maxHeight: '80%',
    marginTop: '50%',
  },


  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },

  receiverInfo:{
    flexDirection: 'column',
    marginLeft: 10,

  },

  receiverType: {
    marginTop: 5,
    fontWeight: 'bold',
    color: 'green' // Màu chữ sẽ là màu xanh
  },

  timeContainer: {
    flexDirection: 'row',
    marginTop: 5,

  },

  username_timeContaner: {
    marginLeft: 10
  }

})


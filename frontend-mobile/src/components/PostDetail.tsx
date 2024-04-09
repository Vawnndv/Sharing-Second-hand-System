import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Text, Image, ScrollView, Modal, TouchableOpacity, ActivityIndicator, Alert  } from 'react-native';
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
import { ReceiveForm } from './ReceiveForm/ReceiveForm';

import { useNavigation } from '@react-navigation/native';




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

  const [modalReceiveFromVisible, setModalReceiveFromVisible] = useState(false);
  const [modalGiveFromVisible, setModalGiveFromVisible] = useState(false);

  const [selectedReceiveMethod, setSelectedReceiveMethod] = useState(' ');
  const [selectedGiveMethod, setSelectedGiveMethod] = useState(' ');


  const methodsReceive = ["Nhận đồ qua kho", "Nhận đồ trực tiếp"];
  const methodsGive = ["Đem đồ đến kho", "Chúng tôi sẽ đến lấy"];
  const navigation = useNavigation();


  
  const handleMethodReceiveSelected = (method : string) => {
    if(method != ' ' && post){
      setSelectedReceiveMethod(method);
      createPostReceiver(method);
    }
    setModalReceiveFromVisible(false);
    // Tại đây bạn có thể chuyển người dùng đến form tiếp theo hoặc xử lý lựa chọn
  };


  const handleMethodGiveSelected = (method : string) => {
    if(method != ' ' && post){
      setSelectedGiveMethod(method);
      createPostReceiver(method);
    }
    setModalGiveFromVisible(false);
    // Tại đây bạn có thể chuyển người dùng đến form tiếp theo hoặc xử lý lựa chọn
  };

  const createPostReceiver = async (method: string) => {
    try {

      const foundReceiver = postReceivers.find(receiver => receiver.receiverid === auth.id);

      if(foundReceiver){
        Alert.alert('Thất bại', 'Bạn đã gửi yêu cầu nhận món hàng này rồi');
        return;
      }
    

      const postid = postID;
      const receiverid = auth.id; // Thay đổi giá trị này tùy theo logic ứng dụng của bạn
      const comment = '';
      const time = new Date();
      let receivertypeid = 1;
      if(method == "Nhận đồ qua kho"){
        receivertypeid = 2;
      }
      
      // console.log({title, location, description, owner, time, itemid, timestart, timeend})
      const response = await axios.post(`${appInfo.BASE_URL}/posts/createPostReceiver`, {
        postid,
        receiverid,
        comment,
        time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
        receivertypeid,
      });       
      console.log(response.data.postCreated);
      Alert.alert('Thành công', 'Gửi yêu cầu nhận hàng thành công');
    } catch (error) {
      console.error('Error gửi yêu cầu nhận hàng thất bại:', error);
      Alert.alert('Error', 'Gửi yêu cầu nhận hàng thất bại.');
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      let itemIDs = null;
      let owner = null
      try {
        console.log(postID);
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
        setIsUserPost(res.data.postDetail.owner == auth.id);
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
        const res = await axios.get(`${appInfo.BASE_URL}/posts/postreceivers/${postID}`)
        if (!res) {
          throw new Error('Failed to fetch post receivers'); // Xử lý lỗi nếu request không thành công
        }
        setPostReceivers(res.data.postReceivers); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching post receivers:', error);
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }

      try {
        setIsLoading(true);
        const res = await userAPI.HandleUser(`/profile?userId=${owner}`);
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

}, [postID])


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if(selectedMethod != ' ' && postID){
  //   return(
  //     <ReceiveForm method={selectedMethod} postID={postID}/>
  //   )
  // }

  if(!isLoading){
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
                              <Text style={styles.receiverType}>{postReceiver?.give_receivetype}</Text>
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
                  <Text style={styles.username}>{profile?.firstname ? profile.lastname ? profile.firstname + ' ' + profile.lastname : profile?.username ? profile?.username : ' ' : profile?.username ? profile?.username : ' '}</Text>

                  {/* Hiển thị ngày đăng */}
                  <View style={styles.timeContainer}>
                    <SimpleLineIcons name="clock" size={20} color="black" />
                    <Text style={{marginLeft: 5}}>{moment(post?.time).format('DD-MM-YYYY')}</Text>
                  </View>
                </View>

                {isUserPost && (
                  <Button style={styles.button} onPress={() => setModalVisible(true)} mode="contained">Cho</Button>
                  
                )}
                {/* Nút chỉ hiển thị khi isUserPost là false */}
                {!isUserPost && (
                  <View style = {styles.button_modal_container}>
                    <Button style={styles.button_receiver} onPress={() => setModalReceiveFromVisible(true)} mode="contained">Nhận</Button>
                    {modalReceiveFromVisible && (
                      <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalReceiveFromVisible}
                      onRequestClose={() => setModalReceiveFromVisible(false)}
                      >
                      <View style={styles.centeredModalReceiveView}>
                        <View style={styles.modalReceiveView}>
                          <Text style={styles.title}>Chọn phương thức nhận đồ:</Text>
                          <View style={styles.methodContainer}>
                              {methodsReceive.map((method) => (
                                <TouchableOpacity style={styles.methodStyle} key={method} onPress={() => handleMethodReceiveSelected(method)}>
                                  <Text style={styles.modalText}>{method}</Text>
                                </TouchableOpacity>
                              ))}
                          </View>
                          <TouchableOpacity onPress={() => setModalReceiveFromVisible(false)}>
                              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                    )}
                  </View>
                )}
                </View>
              {/* Hiển thị tiêu đề bài đăng */}
              <Text style={styles.title}>{post?.title}</Text>

              {/* Hiển thị mô tả bài đăng */}
              <Text style={styles.description}>{post?.description}</Text>

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
                        // <Button style={styles.button} onPress={() => {/* Xử lý khi nút được nhấn */}} mode="contained">Cho</Button>
                        <View style = {styles.button_modal_container}>
                          <Button style={styles.button_receiver} onPress={() => setModalGiveFromVisible(true)} mode="contained">Cho</Button>
                          {modalGiveFromVisible && postReceiver.give_receivetype == 'Cho nhận qua kho' && (
                            <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalGiveFromVisible}
                            onRequestClose={() => setModalGiveFromVisible(false)}
                            >
                            <View style={styles.centeredModalReceiveView}>
                              <View style={styles.modalReceiveView}>
                                <Text style={styles.title}>Chọn phương thức đêm đồ đến kho:</Text>
                                <View style={styles.methodContainer}>
                                    {methodsGive.map((method) => (
                                      <TouchableOpacity style={styles.methodStyle} key={method} onPress={() => handleMethodGiveSelected(method)}>
                                        <Text style={styles.modalText}>{method}</Text>
                                      </TouchableOpacity>
                                    ))}
                                </View>
                                <TouchableOpacity onPress={() => setModalGiveFromVisible(false)}>
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>Đóng</Text>
                                  </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                          )}
                        </View>
                        
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white'
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
    marginTop: 5,
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
  },

  centeredModalReceiveView: {
    flex: 1,
    justifyContent: 'flex-end', // Điều chỉnh modal xuất hiện ở cuối màn hình
    alignItems: 'center',
  },
  modalReceiveView: {
    width: '100%', // Chiếm toàn bộ chiều rộng màn hình
    height: '30%',
    backgroundColor: '#4B0082',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold', // Làm cho chữ đậm
    fontSize: 16, // Làm cho chữ to hơn
  },
  // Thêm style cho tùy chọn được highlight

  button_modal_container: {
    flexDirection: 'row', // Đặt hướng của container
    width: '75%',
    justifyContent: 'flex-end'
  },


  button_receiver: {
    // marginLeft: '10%',

  },

  methodContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // backgroundColor: 'rgb(240, 240, 240)',
    width: '100%',    
    borderRadius: 10,

  },

  methodStyle: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  }
})


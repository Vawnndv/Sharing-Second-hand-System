import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';


import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import userAPI from '../apis/userApi';
import { appInfo } from '../constants/appInfos';
import { ProfileModel } from '../models/ProfileModel';
import { authSelector } from '../redux/reducers/authReducers';
import AvatarComponent from './AvatarComponent';
import { ReceiveForm } from './ReceiveForm/ReceiveForm';

import LastMessageComponent from './LastMessageComponent';

import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import ShowMapComponent from './ShowMapComponent';
// import ImageCropPicker from 'react-native-image-crop-picker';

import { useFocusEffect } from '@react-navigation/native';
import { DirectboxReceive, Flag, Heart } from 'iconsax-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Đảm bảo đã cài đặt thư viện này
import postsAPI from '../apis/postApi';
import ReportModal from '../modals/ReportModal';


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
  longitude?: string;
  latitude?: string;
}


interface Item {
  itemID: number;
  name: string;
  itemtypeid: string;
  quantity: number;
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
  navigation?: any;
  route?: any;
  fetchFlag?: any;
}

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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const PostDetail: React.FC<PostDetailProps> = ( {navigation, route, postID, fetchFlag} ) =>{
  // const navigation = useNavigation();
  // const  Avatar = sampleUserOwner.Avatar;
  // console.log(postID)

  const [post, setPost] = useState<Post | any>(null); // Sử dụng Post | null để cho phép giá trị null
  const [postReceivers, setPostReceivers] = useState<PostReceiver[]>([]);
  const [profile, setProfile] = useState<ProfileModel>();
  const [itemImages, setItemImages] = useState<ItemImage[]>([]);
  const [itemDetails, setItemDetails] = useState<Item | any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchData, setIsFetchData] = useState<any>(true);

  const [isUserPost, setIsUserPost] = useState(false);
  const [itemID, setItemID] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const auth = useSelector(authSelector);

  const [receivemethod, setReceiveMethod] = useState('');
  const [receivetypeid, setReceiveTypeID] = useState<number>();
  const [warehouseid, setWareHouseID] = useState<number>()

  const [selectedReceiver, setSelectedReceiver] = useState<number>();


  const [goToReceiveForm, setGoToReceiveForm] = useState(false);
  const [goToGiveForm, setGoToGiveForm] = useState(false);

  // Handle chat
  const [item, setItem] = useState<any>(undefined)
  const [goToChat, setGoToChat] = useState(false);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(itemImages.length > 1 ? true : false);

  const [amountLike, setAmountLike] = useState(0)

  const [visibleModalReport, setVisibleModalReport] = useState(false)

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;  // Lấy vị trí lướt ngang hiện tại
    const scrollViewWidth = event.nativeEvent.layoutMeasurement.width;  // Chiều rộng của view hiển thị
    const contentWidth = event.nativeEvent.contentSize.width;  // Tổng chiều rộng của nội dung

    // Kiểm tra để hiển thị mũi tên trái
    if (scrollPosition > 0) {
      setShowLeftArrow(true);
    } else {
      setShowLeftArrow(false);
    }

    // Kiểm tra để hiển thị mũi tên phải
    if (scrollPosition + scrollViewWidth < contentWidth) {
      setShowRightArrow(true);
    } else {
      setShowRightArrow(false);
    }
  };

  // Check when chat screen go back to postdetail
  useFocusEffect(
    React.useCallback(() => {
      setGoToChat(false);
    }, [])
  );

  const openChatRoomReceive = ({item, postid}: any)=> {
    setGoToChat(true)

    navigation.navigate('ChatRoomScreen', {
      item: item,
      postid: postid
    });
  }

  const handleReceiveForm = async () => {
    const isReceived = postReceivers.find(postReceiver => postReceiver.receiverid == auth.id);


    if(!isReceived){
      setGoToReceiveForm(true);
    }
    else{
      setGoToReceiveForm(false);
      Alert.alert('Thất bại', 'Bạn đã yêu cầu nhận món đồ này rồi!');
      return;
    }
  };

  const deletePostReceiver = async () => {
    try {
      setIsLoading(true);
      const res = await postsAPI.HandlePost(
        `/deletepostreceivers?postID=${postID}&receiverID=${auth.id}`,
        '',
        'delete'
      );

      setIsLoading(false);
      navigation.goBack()
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelReceive = () => {
    deletePostReceiver()
  };

  const handleGiveForm = (receiveid: number, receivemethod: string, receivetypeid: number, warehouseid: number) => {
    setSelectedReceiver(receiveid);
    setReceiveMethod(receivemethod);
    setReceiveTypeID(receivetypeid);
    setWareHouseID(warehouseid);
    setGoToGiveForm(true);
    setModalVisible(false);

  };

  useEffect(() => {
    if(fetchFlag){
      setIsFetchData(!isFetchData);
    }
  },[fetchFlag])



 
    const fetchAllData = async () => {
      let itemIDs = null;
      let owner = null

      try{
        setIsLoading(true);
        const res: any = await axios.get(`${appInfo.BASE_URL}/posts/get-amount-user-like-post?postID=${postID}`)
        setAmountLike(res.data.amount)

      }catch(error){
        console.log(error)
      }

      try {
        // console.log(postID);
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
        setShowRightArrow(res.data.itemImages > 1 ? true : false)
        // setItemID(data.id);
      
      } catch (error) {
        console.error('Error fetching item details:', error);
      }

      try {

        const res = await axios.get(`${appInfo.BASE_URL}/items/${itemIDs}`)
        if (!res) {
          throw new Error('Failed to fetch post receivers'); // Xử lý lỗi nếu request không thành công
        }
        console.log(res.data);
        setItemDetails(res.data.item); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching post receivers:', error);
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


    useFocusEffect(
      useCallback(() => {
        fetchAllData();
      }, [postID, fetchFlag])
    );
  
    useEffect(() => {
      if (fetchFlag) {
        fetchAllData();
        navigation.setParams({ fetchFlag: false });
      }
    }, [fetchFlag]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if(goToReceiveForm  && postID && !isUserPost){
    setGoToReceiveForm(false);
    navigation.navigate('ReceiveFormScreen', {
      postID: postID,
    });
    // setPost(null);
  }

  if(goToGiveForm && postID  && isUserPost){
    setGoToGiveForm(false);
    navigation.navigate('ReceiveFormScreen', {
      postID: postID,
      receiveid: selectedReceiver,
      receivetype: receivemethod,
      receivetypeid: receivetypeid,
      warehouseid: warehouseid,
    });
    // setPost(null);
    <ReceiveForm
      postID = {postID}
      setIsFetchData = {setIsFetchData}
    />
  }

  if(!goToChat && !isLoading && !goToReceiveForm && !goToGiveForm){
    return(
      <ScrollView>
        <View style={styles.screenContainer}>
            {modalVisible && (
            <View style={styles.overlayContainer} />
            )}
          <View style={styles.img_icon_container}>
            {showLeftArrow  && (
              <TouchableOpacity style={[styles.arrow, styles.leftArrow]}>
                <Icon name="chevron-left" size={50}  color="#000" />
              </TouchableOpacity>
            )}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.imageContainer}
              pagingEnabled={true}
              onScroll={handleScroll}
              onScrollBeginDrag={handleScroll}
              scrollEventThrottle={5}  // Cập nhật vị trí scroll mỗi 16ms
              >
                {itemImages?.map((itemImage, index) => (
                  <Image
                  key={index}
                  source={{ uri: itemImage.path }}
                  style={styles.itemPhoto}
                  />
                ))}
            </ScrollView>
            {showRightArrow  && (
              <TouchableOpacity style={[styles.arrow, styles.rightArrow]}>
                <Icon name="chevron-right" size={50} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.like_receiver_CountContainer}>
            {/* <AntDesign name="inbox" size={24} color="green" /> */}
            <DirectboxReceive size={24} color={appColors.green} variant={ 'Bold' }/>
            <Text style={styles.receiverCount}>Người xin nhận: {postReceivers.length}</Text>
            {/* <AntDesign name="hearto" size={24} color="red" /> */}
            <Heart size={24} color={appColors.heart} variant={ 'Bold' }/>
            <Text style={styles.loverCount}>Thích: {amountLike}</Text>
          </View>

          

          <View style={styles.container}>
            {modalVisible && (
            <View style={styles.overlayContainer} />
            )}
            <View style={styles.postContainer}>
              <Modal
                onDismiss={() => {setModalVisible(false)}}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Cửa sổ đã bị đóng.');
                  setModalVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={() => {setModalVisible(false)}}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <ScrollView style={styles.ModalScrollView}>
                                <Text style={styles.title}>Chọn người bạn muốn cho</Text>
                                {postReceivers.map((postReceiver: any, index: number) => (
                                    <View style={styles.receiverModalContainer} key={index}>
                                        <View style={styles.userInfo}>
                                            <AvatarComponent
                                                avatar={postReceiver?.avatar}
                                                username={ postReceiver?.firstname ? postReceiver?.firstname : ' '}
                                                styles={styles.avatar}
                                                onPress={() => {
                                                  navigation.navigate(
                                                    'ProfileScreen',
                                                    {
                                                      id: postReceiver.receiverid
                                                    },
                                                  );
                                                }}
                                            />
                                            <View style={styles.receiverInfo}>
                                                <Text style={styles.username_receiver}>{postReceiver.firstname + ' ' + postReceiver.lastname}</Text>
                                                <Text style={styles.receiverType}>{postReceiver?.give_receivetype}</Text>
                                            </View>
                                            {isUserPost && (
                                                <TouchableOpacity style={styles.button} onPress={() => handleGiveForm(postReceiver.receiverid, postReceiver.give_receivetype, postReceiver.receivertypeid, postReceiver.warehouseid ? postReceiver.warehouseid : 0)}><Text style={{color: 'white'}}>Cho</Text></TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
              </Modal>

              <View style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', marginRight: 10, alignItems: 'center'}}>
                {(auth.id !== post?.owner) && (
                  <TouchableOpacity
                    style={{marginRight: 10, marginLeft: 10}}
                    onPress={() => {
                      openChatRoomReceive({
                        item: {
                          avatar: profile?.avatar,
                          userid: post.owner,
                          username: profile?.firstname ? `${profile.firstname} ${profile.lastname}` : ' ',
                          firstname: profile?.firstname,
                          lastname: profile?.lastname,
                        },
                        postid: postID,
                      });
                    }}
                  >
                    <Ionicons name='chatbubbles-outline' size={28} color={appColors.primary2} />
                  </TouchableOpacity>
                  
                )}
                <View style={{flex: 1}}>
                  {(auth.id !== post?.owner) && (
                    <TouchableOpacity
                      onPress={() => 
                        setVisibleModalReport(true)
                      }
                    >
                      <Flag
                        size="28"
                        color={appColors.green}
                        variant="Outline"
                      />
                    </TouchableOpacity>
                    
                  )}
                </View>


              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                  {/* <View style={{flexDirection: 'column', gap: 10}}> */}
                    {isUserPost && post?.statusid === 12 && (
                      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}><Text style={{color: 'white'}}>Cho</Text></TouchableOpacity>
                    )}
                    {/* Nút chỉ hiển thị khi isUserPost là false */}
                    {!isUserPost && post?.statusid === 12 && (
                      <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        {
                          postReceivers.some(postReceiver => postReceiver.receiverid === auth.id) ?
                          <TouchableOpacity style={styles.button} onPress={() => {handleCancelReceive();}} ><Text style={{color: 'white'}}>Hủy</Text></TouchableOpacity>
                          :
                          <TouchableOpacity style={styles.button} onPress={() => {handleReceiveForm();}} ><Text style={{color: 'white'}}>Xin nhận</Text></TouchableOpacity>
                        }
                        
                      </View>
                    )}
                  {/* </View> */}
                </View>
              </View>

              <View style={styles.userContainer}>
                {/* Hiển thị avatar của user */}
                <View style={[styles.userContainer, {paddingLeft: 0 }]}>
                  <AvatarComponent 
                    avatar={profile?.avatar}
                    username={ profile?.firstname + ' ' + profile?.lastname}
                    styles={styles.avatar}
                    onPress={() => {
                      navigation.navigate(
                        'ProfileScreen',
                        {
                          id: post.owner
                        },
                      );
                    }}
                  
                  />
                  <View style={[styles.username_timeContaner, {rowGap: 5}]}>
                  {/* Hiển thị tên của user */}
                    <Text style={styles.username_owner}><Text style={{fontWeight: 'bold', color: 'black'}}>{ profile?.firstname  + ' ' + profile?.lastname }</Text> đang muốn cho đồ</Text>
                    <Text style={{fontFamily: fontFamilies.regular, fontSize:16, fontWeight: 'bold'}}>{post?.title}</Text>



                    {/* Hiển thị ngày đăng */}
                    <View style={styles.timeContainer}>
                      <SimpleLineIcons name="clock" size={16} color="grey" />
                      <Text style={{marginLeft: 3, fontSize: 13, color: 'gray'}}>{moment(post?.time).fromNow()}</Text>

                    </View>
                  </View>

                </View>


                
                </View>
              {/* Hiển thị tiêu đề bài đăng */}

              {/* Hiển thị mô tả bài đăng */}

              <View style = {styles.duration_descriptionContainer}>

                <Text style={[styles.description, {marginBottom: 10}]}>{post?.description}</Text>

                <View>
                <Text style={styles.title}>Thông tin món đồ</Text>
                <Text style={styles.duration}>{'Tên sản phẩm: ' + itemDetails?.name}</Text>
                <Text style={styles.duration}>{'Số lượng: ' + itemDetails?.quantity}</Text>

                </View>

                <View style={styles.durationContainer}>
                  <Text style={styles.title}>Thời gian cho đồ</Text>

                  <Text style={styles.duration}>{'Từ ngày ' + moment(post?.timestart).format('DD-MM-YYYY') + ' đến ngày ' + moment(post?.timeend).format('DD-MM-YYYY')} </Text>
                </View>

                
                <View style={styles.address_mapContainer}>
                  <Text style={styles.title}>Địa điểm cho đồ</Text>

                  <Text style={styles.address}>{post?.address}</Text>

                </View>

                {post !== undefined && post !== null && (
                  <View style={{marginTop: 20}}>
                    <ShowMapComponent
                        location={{
                          address: post.address,
                          latitude: parseFloat(post.latitude),
                          longitude: parseFloat(post.longitude),
                        }}
                        useTo={'no'}
                    />
                  </View>
                  
                )}                
              </View>


            </View>

            <ScrollView>
              {postReceivers.map((postReceiver, index) => {
                if(postReceiver.receiverid == auth.id || auth.id == post.owner){
                  
                return (
                  <TouchableOpacity onPress={() => {
                    if(auth.id === post.owner) {
                      openChatRoomReceive({item: {
                        avatar: postReceiver?.avatar,
                        userid: postReceiver.receiverid,
                        username: postReceiver?.username,
                        firstname: postReceiver?.firstname,
                        lastname: postReceiver?.lastname,
                      }, 
                        postid: postID})
                    } else {
                      openChatRoomReceive({item: {
                        avatar: profile?.avatar,
                        userid: post.owner,
                        username: profile?.firstname ? profile?.firstname + profile?.lastname : ' ',
                        firstname: profile?.firstname,
                        lastname: profile?.lastname,
                      }, 
                        postid: postID}) 
                    }

                    }} key={index}>
                    <View style={styles.receiverContainer} key={index}>
                      <View style={styles.userInfo}>
                        <View style={{flexDirection: 'row'}}>
                          <AvatarComponent 
                            avatar={postReceiver.avatar}
                            username={postReceiver.username ? postReceiver.username : postReceiver.firstname + ' ' + postReceiver.lastname}
                            styles={styles.avatar}
                            onPress={() => {
                              navigation.navigate(
                                'ProfileScreen',
                                {
                                  id: postReceiver.receiverid
                                },
                              );
                            }}
                          />  
                          <View style={styles.receiverInfo}>
                            <Text style={styles.username_receiver}>{postReceiver.username ? postReceiver.username : postReceiver.firstname + ' ' + postReceiver.lastname}</Text>
                            <Text style={styles.receiverType}>{postReceiver.give_receivetype}</Text>
                          </View>
                        </View>
                        {isUserPost && post?.statusid === 12 && (
                          // <Button style={styles.button} onPress={() => {/* Xử lý khi nút được nhấn */}} mode="contained">Cho</Button>
                          <View>
                            <TouchableOpacity style={styles.button} onPress={() => handleGiveForm(postReceiver.receiverid, postReceiver.give_receivetype, postReceiver.receivertypeid, postReceiver.warehouseid ? postReceiver.warehouseid : 0 )}><Text style={{color: 'white'}}>Cho</Text></TouchableOpacity>
                          </View>
                        )}
                      </View>
                      {/* <Text style={styles.comment}>{postReceiver.comment}</Text> */}
                      <LastMessageComponent firstUserID={postReceiver.receiverid} secondUserID={post.owner} postid={postID}/>
                    </View>
                  </TouchableOpacity>
                );
              }})}
          </ScrollView>
          </View>
        </View>

        {/* <Button mode="contained" onPress={(() => { navigation.navigate('ThankYouScreen', {
                                                    title: 'Gửi bài viết thành công',
                                                    postID: postID,
                                                    content: 'Cảm ơn bạn rất nhiều vì đã cho món đồ, bài viết của bạn sẽ sớm được đội ngũ cộng tác viết kiểm duyệt',
                                                     }) })}>
         Đi đến trang cảm ơn</Button> */}
        {
          post !== null && 
          <ReportModal visible={visibleModalReport} setVisible={setVisibleModalReport} title={post?.title} reportType={2} userID={null} postID={postID} reporterID={auth.id} warehouseID={post.warehouseid}/>
        }
        
      </ScrollView>
    )
  }
}

export default PostDetail;

const styles = StyleSheet.create({

  screenContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },

  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu mờ với opacity là 0.5
    zIndex: 1, // Đảm bảo overlay được đặt trên mọi thành phần khác
  },
  container: {
    // marginTop: 20,
    backgroundColor: 'white',
    width: '100%',
  },
  userContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1
  },
  title: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fontFamilies.medium
    // marginBottom: 5,
    // color: 'white'
  },
  avatar: {
    width: 60, // Giả sử kích thước bạn muốn
    height: 60, // Giả sử kích thước bạn muốn
    borderRadius: 50, // Để làm tròn hình ảnh
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'

  },
  username_owner: {
    alignItems: 'center', // Thêm thuộc tính này
    color: 'grey',

  },

  username_receiver: {
    alignItems: 'center', // Thêm thuộc tính này
    fontWeight: 'bold',
  },

  description: {
    fontSize: 16,
  },

  duration: {
    fontSize: 14,
    // fontStyle: 'italic',
    paddingTop: 5,
    color: 'gray',


  },

  durationContainer:{
    // padding: 15
    marginTop: 10,
  },

  duration_descriptionContainer:{
    padding: 10,
    // marginTop: ,
  },

  postContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 5,
  },

  receiverContainer: {
    flexDirection: 'column', // Sắp xếp các phần tử theo chiều ngang
    // alignItems: 'center', // Căn chỉnh các phần tử theo chiều dọc
    margin: 10,
    padding: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 6,
    flex: 1,
    elevation: 8,
    shadowOffset: {width: 50, height: 5},
    shadowOpacity: 0.5,
    shadowColor: 'black'
    // justifyContent: 'space-between',
  },

  itemPhoto: {
    width: windowWidth,
    height: windowHeight * 0.4,
  },

  comment: {
    fontStyle: 'italic', // Nghiêng chữ
    marginTop: 20,
  },

  like_receiver_CountContainer: {
    fontWeight: 'bold',
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#ECECEC',
    width: '100%',
    justifyContent: 'flex-end', // Đảm bảo các phần tử nằm ở cuối container
    marginBottom: 15,
    alignItems: 'center'
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
    // backgroundColor: appColors.primary2,
    elevation: 8,
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 1,
    shadowColor: 'white',
    backgroundColor: appColors.primary2,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,

    // elevation: 8,
    // shadowOffset: {width: 50, height: 5},
    // shadowOpacity: 0.5,
    // shadowColor: 'black'
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
    // marginTop: '50%',
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
    alignItems: 'center',
    columnGap: 2
  },

  username_timeContaner: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 15
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
    justifyContent: 'flex-end',
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
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10

  },

  imageContainer: {

  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu làm mờ và độ trong suốt
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  ModalScrollView: {
    // maxHeight: windowHeight * 0.5, // Điều chỉnh chiều cao tối đa của ScrollView tùy thuộc vào nhu cầu của bạn
    height: '50%',
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    padding: 10,
    borderRadius: 10,
    // justifyContent: 'center',
  },

  address_mapContainer: {
    marginTop: 10
  },

  address: {

    fontSize: 14,
    paddingTop: 5,
    color: 'gray',

  },

  map:{
    fontSize: 14,
    fontStyle: 'italic',
    paddingTop: 5,
    color: 'gray',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    zIndex: 10,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Thêm nền để tăng độ rõ nét cho mũi tên
    borderRadius: 15,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },

  img_icon_container: {
    flexDirection: 'row',
    alignItems: 'center',
  }

})


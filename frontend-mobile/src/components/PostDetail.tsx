import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Text, Image, ScrollView, Modal, TouchableOpacity  } from 'react-native';
import { StringLiteral } from 'typescript';
import { AntDesign, SimpleLineIcons  } from '@expo/vector-icons';

import moment from 'moment';



interface Post {
  PostID: number; // Do SERIAL tự tăng nên giá trị này sẽ được tự động sinh ra và là duy nhất
  Title: string; // VARCHAR(255) và NOT NULL nên đây là một chuỗi không được phép rỗng
  Location?: string; // TEXT có thể null
  Description?: string; // TEXT có thể null
  Owner: number; // INT, tham chiếu đến UserID trong bảng User
  Time?: Date; // TIMESTAMP có thể null
  ItemID?: number; // INT, tham chiếu đến ItemID trong bảng Item, có thể null
  TimeStart?: Date; // DATE có thể null
  TimeEnd?: Date; // DATE có thể null
  createdAt: Date; // TIMESTAMP NOT NULL, lưu thời gian tạo bản ghi
}

interface User {
  UserID: number;
  Username: string;
  Password: string;
  FirstName?: string; // Optional vì có thể là NULL
  LastName?: string; // Optional vì có thể là NULL
  PhoneNumber?: string; // Optional vì có thể là NULL
  Email: string;
  Avatar?: string; // Optional vì có thể là NULL
  DateOfBirth?: Date; // Optional vì có thể là NULL
  RoleID: number;
  createdAt: Date;
}

interface Item {
  itemID: number;
  itemName: string;
  itemPhotos: string[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc
  itemCategory: string;
  itemQuantity: string;
  itemDescription: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}


interface PostDetailProps {
  post: Post;
  user: User;
  item: Item;
}

interface PostReceiver {
  PostID: number;
  ReceiverID: number;
  Comment: string;
  Time: Date;
  createdAt: Date;
  receiverType: string;
}

const sampleUserOwner: User = {
  UserID: 1, // Trong thực tế, giá trị này thường được tự động sinh ra bởi cơ sở dữ liệu
  Username: "john_doe",
  Password: "securePassword123", // Lưu ý: Mật khẩu này nên được mã hóa
  FirstName: "John",
  LastName: "Doe",
  PhoneNumber: "123-456-7890",
  Email: "johndoe@example.com",
  Avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Labrador_Retriever_portrait.jpg/1200px-Labrador_Retriever_portrait.jpg",
  DateOfBirth: new Date("1990-01-01"),
  RoleID: 1, // Giả sử rằng RoleID này đã tồn tại và hợp lệ
  createdAt: new Date(), // Đặt ngày tạo là ngày hiện tại
};


const samplePost: Post = {
  PostID: 1, // Giả sử giá trị này đã tự động sinh ra bởi cơ sở dữ liệu
  Title: "Bán đồ cũ",
  Location: "Hà Nội, Việt Nam",
  Description: "UA Tech is our original go-to training gear: Under Armour men's Tech polos are loose, light, and keep you cool. Basically, they're built to be everything you need.",
  Owner: 1, // Giả sử UserID của người đăng là 1
  Time: new Date("2024-03-27T08:00:00Z"), // Thời gian đăng bài
  ItemID: 1, // Giả sử món hàng có ID là 1
  TimeStart: new Date("2024-03-28"), // Thời gian bắt đầu hiển thị sản phẩm
  TimeEnd: new Date("2024-04-10"), // Thời gian kết thúc hiển thị sản phẩm
  createdAt: new Date(), // Thời gian tạo bài đăng
};

const sampleItem: Item = {
  itemID: 1, // Giả sử giá trị này đã tự động sinh ra bởi cơ sở dữ liệu
  itemName: "Áo thun nam",
  itemPhotos: [
    "https://m.media-amazon.com/images/I/617iMeLtb+L._AC_SX679_.jpg",
    "https://m.media-amazon.com/images/I/518Y3wD8pSL._AC_SX569_.jpg",
    "https://m.media-amazon.com/images/I/71gYxM-z0DL._AC_SX569_.jpg",
  ],
  itemCategory: "Quần áo",
  itemQuantity: "10",
  itemDescription: "Áo thun nam phong cách, chất liệu cotton thoáng mát, phù hợp với mọi lứa tuổi.",
  // Các thuộc tính khác nếu cần
};


const sampleUsers: User[] = [
  {
    UserID: 2,
    Username: "trôn",
    Password: "securePassword123",
    FirstName: "John",
    LastName: "Doe",
    PhoneNumber: "123-456-7890",
    Email: "johndoe@example.com",
    Avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3tNB5rc_qoyctOaIfedxwg0_psN3pSHJQwQ&usqp=CAU",
    DateOfBirth: new Date("1990-01-01"),
    RoleID: 1,
    createdAt: new Date(),
  },

  {
    UserID: 3,
    Username: "Tan",
    Password: "securePassword123",
    FirstName: "John",
    LastName: "Doe",
    PhoneNumber: "123-456-7890",
    Email: "johndoe@example.com",
    Avatar: "https://i.guim.co.uk/img/media/260fa2f0810f1d7e825da17aa07eb31923c4eba8/0_726_4000_2400/master/4000.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=be82fc09a5341967681a67fd73b08fc4",
    DateOfBirth: new Date("1990-01-01"),
    RoleID: 1,
    createdAt: new Date(),
  },
];

const postReceivers: PostReceiver[] = [
  {
    PostID: 1,
    ReceiverID: 2,
    Comment: "Great post!",
    Time: new Date("2024-03-26T08:00:00Z"),
    createdAt: new Date("2024-03-26T08:30:00Z"),
    receiverType: 'Xin đồ qua kho'
  },
  {
    PostID: 1,
    ReceiverID: 3,
    Comment: "Interesting post!",
    Time: new Date("2024-03-27T10:15:00Z"),
    createdAt: new Date("2024-03-27T10:45:00Z"),
    receiverType: 'Xin đồ trực tiếp'
  },
];


const examplePost: Post = {
  PostID: 1,
  Title: "Bài đăng mẫu",
  Owner: 1,
  createdAt: new Date() // Sử dụng Date hiện tại cho ví dụ
  // Các trường khác không bắt buộc có thể bỏ trống nếu không có dữ liệu
};

const PostDetail: React.FC<PostDetailProps> = ({post, user, item}) =>{
  // const  Avatar = sampleUserOwner.Avatar;

  const isUserPost = post.Owner === user.UserID;
  // const isItemMatch = post.ItemID === item.itemID;
  const [modalVisible, setModalVisible] = useState(false);



  // if (!isUserPost || !isItemMatch) {
  //   return null;
  // }
  return(
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
                  // Tìm user từ sampleUsers có UserID trùng với ReceiverID của postReceiver
                  const user = sampleUsers.find(user => user.UserID === postReceiver.ReceiverID);
                  // Nếu không tìm thấy user hoặc postID không trùng khớp, không hiển thị
                  if (!user || post.PostID !== postReceiver.PostID) {
                    return null;
                  }
                  return (
                    <View style={styles.receiverModalContainer} key={index}>
                      <View style={styles.userInfo}>
                        <Image source={{ uri: user.Avatar }} style={styles.avatar} />
                        <View style={styles.receiverInfo}>
                          <Text style={styles.username}>{user.Username}</Text>
                          <Text style={styles.receiverType}>{postReceiver.receiverType}</Text>
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
            <Image source={{ uri: user.Avatar }} style={styles.avatar} />
            
            <View style={styles.username_timeContaner}>
            {/* Hiển thị tên của user */}
              <Text style={styles.username}>{user.Username}</Text>

              {/* Hiển thị ngày đăng */}
              <View style={styles.timeContainer}>
                <SimpleLineIcons name="clock" size={20} color="black" />
                <Text style={{marginLeft: 5}}>{moment(post.Time).format('DD-MM-YYYY')}</Text>
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
          <Text style={styles.title}>{post.Title}</Text>

          {/* Hiển thị mô tả bài đăng */}
          <Text style={styles.description}>{post.Description}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.itemPhotos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.itemPhoto} />
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
            // Tìm user từ sampleUsers có UserID trùng với ReceiverID của postReceiver
            const user = sampleUsers.find(user => user.UserID === postReceiver.ReceiverID);
            // Nếu không tìm thấy user hoặc postID không trùng khớp, không hiển thị
            if (!user || post.PostID !== postReceiver.PostID) {
              return null;
            }
            return (
              <View style={styles.receiverContainer}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: user.Avatar }} style={styles.avatar} />
                  <View style={styles.receiverInfo}>
                    <Text style={styles.username}>{user.Username}</Text>
                    <Text style={styles.receiverType}>{postReceiver.receiverType}</Text>
                  </View>
                  {isUserPost && (
                    <Button style={styles.button} onPress={() => {/* Xử lý khi nút được nhấn */}} mode="contained">Give</Button>
                  )}
                </View>
                <Text style={styles.comment}>{postReceiver.Comment}</Text>
            </View>
            );
          })}
      </ScrollView>
      </View>
    </View>
  )
}

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
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgb(240, 240, 240)',
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
    marginLeft: 5,
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

export default PostDetail;
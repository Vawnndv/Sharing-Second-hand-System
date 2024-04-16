import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { useEffect, useState } from "react";
import axios from "axios";
import { appInfo } from "../../constants/appInfos";
import moment from "moment";
import { authSelector } from "../../redux/reducers/authReducers";
import { useSelector } from "react-redux";
import { ContainerComponent } from "../../components";
import { LoadingModal } from "../../modals";
import * as ImagePicker from "expo-image-picker"
import { getGallaryPermission, getCameraPermission, TakePhoto, PickImage, UploadImageToAws3, uploadImage } from "../../ImgPickerAndUpload"
import ConfirmComponent from "../../components/ConfirmComponent";
import { Alert } from "react-native";

export default function OrderDetailsScreen({navigation, route}: any) {

    const auth = useSelector(authSelector)
    
    const {orderID, status} = route.params

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
    const [hasCameraPermission, setHasCameraPermission] = useState(false)

    const [image, setImage] = useState<any>(null)

    const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false)
    const [confirm, setConfirm] = useState(false)

    const handleConfirm = async () => {
        setIsLoading(true);
        
        const data = await UploadImageToAws3(image);
        // const urlConfirm = response.url
        await axios.put(`${appInfo.BASE_URL}/updateCompleteOrder/${orderID}`,{
            url: data.url
        });
        setIsLoading(false);
        Alert.alert('Thông báo','Xác nhận đơn hàng thành công!')
        navigation.goBack();
    }

    const receiveOrder = async () => {
        setIsVisibleModalConfirm(true)
    }

    // khi mà người dùng xác nhận giao hàng thì thực hiện cập nhật dữ liệu
    const updateReceiver = async () => {
        const collabID = status === 'Chờ cộng tác viên lấy hàng' ? auth.id : null
        const statusOrder = status === 'Chờ cộng tác viên lấy hàng' ? 'Hàng đang được đến lấy' : 'Chờ cộng tác viên lấy hàng'
        console.log(collabID, statusOrder)
        await axios.put(`${appInfo.BASE_URL}/updateStatusOrder/${orderID}`,{
            status: statusOrder
        });
        const response = await axios.put(`${appInfo.BASE_URL}/updatePinOrder/${orderID}`,{
            collaboratorReceiveID: collabID
        });
        console.log(collabID)
        if(response.data.statusPin === false){
            Alert.alert('Thông báo','Đơn hàng đã được người khác chọn!')
        }else{
            Alert.alert('Thông báo','Chọn đơn hàng thành công!')
        }
        navigation.goBack();
    }

    useEffect(() => {
        if(confirm === true) {
            updateReceiver()
        }
    }, [confirm])

    useEffect(() => {
        const fetchAPI = async () => {
            setIsLoading(true)
            const response = await axios.get(`${appInfo.BASE_URL}/orderDetailsCollab?orderID=${orderID}`)
            setOrders(response.data.orders)
            console.log(response.data.orders[0].imgConfirm)
            if(response.data.orders[0].imgConfirm !== null){
                console.log(true)
                setImage({
                    uri: response.data.orders[0].imgConfirm
                })
            }
            setIsLoading(false)
        }

        fetchAPI()
    }, [])

    useEffect(()  => {
        
        const getPermission = async () => {
            await getCameraPermission(setHasCameraPermission);
            await getGallaryPermission(setHasGalleryPermission);
        }

        getPermission()
        
    }, [])
    console.log(image)
    // const testOrder =  {departure: "Departure Order 3", description: "Description 3", giver: {address: null, avatar: null, dateOfBirth: null, email: "staff@example.com", firstName: "Staff", lastName: "User", password: "staff123", phoneNumber: "456789123", roleID: 19, userID: 30, username: "staff"}, item: {itemtypeid: 6, name: "Laptop", quantity: 10}, location: "Phạm Thế Hiển, Quận 8, Thành phố Hồ Chí Minh", orderCode: "ASD135", orderID: 5, qrCode: "QR789", receiver: {address: "Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh", avatar: "https://upload.wikimedia.org/wikipedia/commons/5/59/The_look_of_John_Wick_from_the_movie.jpg", dateOfBirth: "2002-12-01T17:00:00.000Z", email: "collaborator1@gmail.com", firstName: "John", lastName: "Wick", password: "collaborator1", phoneNumber: "123123123", roleID: 1, userID: 31, username: "collaborator1"}, status: "Pending", time: "2024-03-25T08:03:16.426Z", title: "Order 3"}
    return(
        <ContainerComponent back>
            <View style={styles.container}>
                {/* // seperate */}
                {/* <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View> */}
                {
                    
                    <ScrollView style={{width: '90%'}} showsVerticalScrollIndicator={false}>
                        {
                            orders.map((order: any, index) => {
                                return (
                                    <View key={index}>
                                        <View style={styles.content}>
                                            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Chi tiết đơn hàng</Text>

                                            <View style={styles.infoUser}>
                                                <IconEvil name="location" size={25}/>
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Người cho</Text>
                                                    <Text>{order.order.giver.firstName} {order.order.giver.lastName} - {order.order.giver.phoneNumber}</Text>
                                                    <Text>{order.order.addressGive.address}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.infoUser}>
                                                <IconEvil name="location" color={'red'} size={25}/>
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Người lấy hàng</Text>
                                                    {
                                                        (status === 'Hàng đang được đến lấy' || status === 'Hàng đã nhập kho')  &&(
                                                            <><Text>{order.order.receiver.firstName} {order.order.receiver.lastName} - {order.order.receiver.phoneNumber}</Text>
                                                            <Text>{order.order.addressReceive.address}</Text></>
                                                        )
                                                        
                                                    }
                                                    
                                                </View> 
                                            </View>
                                        </View>

                                        {/* // seperate */}
                                        <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                                        <View style={styles.content}>
                                            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Thông tin đơn hàng</Text>

                                            <View style={[styles.infoUser, {alignItems:'center'}]}>
                                                <Image
                                                    style={{width: 60, height: 60, marginRight: 10}}
                                                    source={
                                                        require('../../../assets/delivery-truck.png')
                                                    }
                                                />
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Lấy hàng trong ngày</Text>
                                                    <Text>Hết hạn vào ngày {moment(order.order.post.timeend).format("DD-MM-YYYY")}</Text>
                                                </View>
                                            </View>

                                            <View style={[styles.infoUser, {alignItems:'center'}]}>
                                                <Image
                                                    style={{width: 60, height: 60, marginRight: 10}}
                                                    source={
                                                        require('../../../assets/delivery-bike.png')
                                                    }
                                                />
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Xe máy</Text>
                                                    <Text>Hàng hóa tối đa 30kg (50x40x50cm)</Text>
                                                </View>
                                            </View>

                                            <View style={[styles.infoUser, {alignItems:'center'}]}>
                                                <Image
                                                    style={{width: 60, height: 60, marginRight: 10}}
                                                    source={
                                                        require('../../../assets/item.png')
                                                    }
                                                />
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Hàng hóa</Text>
                                                    <Text>Số lượng {order.order.item.quantity} - {order.order.item.name}</Text>
                                                </View>
                                            </View>

                                            <Image
                                                style={{marginTop: 20, width: '100%', aspectRatio: 8/5, borderRadius: 10}}
                                                source={{
                                                    uri: order.image
                                                }}
                                            />
                                        </View>
                                        

                                        <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                                        {
                                            status === 'Hàng đang được đến lấy' &&
                                            <View style={styles.content}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Xác nhận đơn</Text>
                                                
                                                <TouchableOpacity style={[styles.infoUser, {alignItems:'center', justifyContent: 'space-evenly'}]}
                                                    onPress={() => TakePhoto(hasCameraPermission, setImage, null)}>
                                                    <Image
                                                        style={{width: 60, height: 60, marginRight: 10}}
                                                        source={{
                                                            uri: "https://cdn-icons-png.flaticon.com/128/3004/3004613.png"
                                                        }}
                                                    />
                                                    <View>
                                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Thêm ảnh đã nhận hàng</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                

                                                {
                                                    image !== null && <Image
                                                        style={{marginTop: 20, width: '100%', aspectRatio: 8/5, borderRadius: 10}}
                                                        source={{
                                                            uri: image.uri
                                                        }}
                                                    />
                                                }
                                                
                                                
                                                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 50, backgroundColor: '#321357',
                                                        paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30,
                                                        display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                                        alignItems: 'center'}}
                                                        onPress={() => handleConfirm()}>
                                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                                        Xác nhận nhận hàng
                                                    </Text>
                                                </TouchableOpacity>
                                                
                                                
                                            </View> 
                                        }

                                        {
                                            status === 'Chờ cộng tác viên lấy hàng' &&
                                            <View style={styles.content}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Giao đơn hàng</Text>
                                            
                                                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 50, backgroundColor: '#321357',
                                                        paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30,
                                                        display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                                        alignItems: 'center'}}
                                                        onPress={() => receiveOrder()}>
                                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                                        Nhận đơn hàng này
                                                    </Text>
                                                </TouchableOpacity>
                                                
                                                
                                            </View>
                                        }

{
                                            status === 'Hàng đã nhập kho' &&
                                            <View style={styles.content}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Xác nhận đơn</Text>
                                                
                                                {
                                                    image !== null && <Image
                                                        style={{marginTop: 20, width: '100%', aspectRatio: 8/5, borderRadius: 10}}
                                                        source={{
                                                            uri: image.uri
                                                        }}
                                                    />
                                                }
                                            </View> 
                                        }
                                        
                                    </View>
                                )
                            })
                        }
                        

                        
                        
                        
                    </ScrollView>
                }
                
                
            </View>
            
            <ConfirmComponent visible={isVisibleModalConfirm} setVisible={setIsVisibleModalConfirm} title={'Bạn có thực sự muốn nhận đơn hàng này?'} setConfirm={setConfirm}/>
            <LoadingModal visible={isLoading}/>
        </ContainerComponent>
        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    infoUser: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        columnGap: 10,
    }
})
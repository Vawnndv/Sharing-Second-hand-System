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
export default function OrderDetailsScreen({navigation, route}: any) {
    
    const {orderID, status} = route.params
    console.log('Details', orderID)

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const handleConfirm = async () => {
        setIsLoading(true);
        await axios.put(`${appInfo.BASE_URL}/updateStatusOrder/${orderID}`);
        setIsLoading(false);
        navigation.goBack();
    }

    useEffect(() => {
        const fetchAPI = async () => {
            setIsLoading(true)
            const response = await axios.get(`${appInfo.BASE_URL}/orderDetailsCollab?orderID=${orderID}`)
            console.log(response.data.orders)
            setOrders(response.data.orders)
            setIsLoading(false)
        }

        fetchAPI()
    }, [])

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
                                                    <Text>{order.receiver.firstName} {order.receiver.lastName} - {order.receiver.phoneNumber}</Text>
                                                    <Text>{order.location}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.infoUser}>
                                                <IconEvil name="location" color={'red'} size={25}/>
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Người lấy hàng</Text>
                                                    <Text>{order.giver.firstName} - {order.giver.lastName} - {order.giver.phoneNumber}</Text>
                                                    <Text>{order.receiver.address}</Text>
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
                                                    <Text>Hết hạn vào ngày {moment(order.post.timeend).format("DD-MM-YYYY")}</Text>
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
                                                    <Text>Số lượng {order.item.quantity} - {order.item.name}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                                        <View style={styles.content}>
                                            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Xác nhận đơn</Text>

                                            <View style={[styles.infoUser, {alignItems:'center', justifyContent: 'space-evenly'}]}>
                                                <Image
                                                    style={{width: 60, height: 60, marginRight: 10}}
                                                    source={{
                                                        uri: "https://cdn-icons-png.flaticon.com/128/3004/3004613.png"
                                                    }}
                                                />
                                                <View>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Thêm ảnh đã nhận hàng</Text>
                                                </View>
                                            </View>

                                            <Image
                                                style={{marginTop: 20, width: '100%', aspectRatio: 16/9, borderRadius: 10}}
                                                source={{
                                                    uri: "https://quangminh.vn/image/cache/catalog/product/may-cat-co-nhat-ban-husqvarna-226r-2766-700x700-product_popup.jpg"
                                                }}
                                            />
                                            {
                                                status === 'Pending' &&
                                                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 50, backgroundColor: '#321357',
                                                        paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30,
                                                        display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                                        alignItems: 'center'}}
                                                        onPress={() => handleConfirm()}>
                                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                                        Xác nhận nhận hàng
                                                    </Text>
                                                </TouchableOpacity>
                                            }
                                            
                                        </View>
                                    </View>
                                )
                            })
                        }
                        

                        
                        
                        
                    </ScrollView>
                }
                
                
            </View>
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
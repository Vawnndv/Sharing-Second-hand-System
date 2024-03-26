import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import axios from "axios";
import { appInfo } from "../../constants/appInfos";
export default function OrderDetailsScreen({navigation, route}: any) {

    const {order} = route.params
    console.log('Details', order)

    const testOrder =  {departure: "Departure Order 3", description: "Description 3", giver: {address: null, avatar: null, dateOfBirth: null, email: "staff@example.com", firstName: "Staff", lastName: "User", password: "staff123", phoneNumber: "456789123", roleID: 19, userID: 30, username: "staff"}, item: {itemtypeid: 6, name: "Laptop", quantity: 10}, location: "Phạm Thế Hiển, Quận 8, Thành phố Hồ Chí Minh", orderCode: "ASD135", orderID: 5, qrCode: "QR789", receiver: {address: "Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh", avatar: "https://upload.wikimedia.org/wikipedia/commons/5/59/The_look_of_John_Wick_from_the_movie.jpg", dateOfBirth: "2002-12-01T17:00:00.000Z", email: "collaborator1@gmail.com", firstName: "John", lastName: "Wick", password: "collaborator1", phoneNumber: "123123123", roleID: 1, userID: 31, username: "collaborator1"}, status: "Pending", time: "2024-03-25T08:03:16.426Z", title: "Order 3"}
    return(

        <View style={styles.container}>
            {/* // seperate */}
            {/* <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View> */}
            <ScrollView style={{width: '90%'}} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Chi tiết đơn hàng</Text>

                    <View style={styles.infoUser}>
                        <IconEvil name="location" size={25}/>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Người cho</Text>
                            <Text>{testOrder.receiver.firstName} {testOrder.receiver.lastName} - {testOrder.receiver.phoneNumber}</Text>
                            <Text>{testOrder.location}</Text>
                        </View>
                    </View>

                    <View style={styles.infoUser}>
                        <IconEvil name="location" color={'red'} size={25}/>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Người lấy hàng</Text>
                            <Text>{testOrder.giver.firstName} - {testOrder.giver.lastName} - {testOrder.giver.phoneNumber}</Text>
                            <Text>Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh</Text>
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
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Lấy hàng trong ngày (còn 3h)</Text>
                            <Text>Dự lấy vào 12:00PM</Text>
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
                            <Text>S - 1kg - Máy cắt cỏ</Text>
                        </View>
                    </View>
                </View>

                {/* // seperate */}
                <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                {/* https://banner2.cleanpng.com/20191006/tje/transparent-photography-icon-camera-icon-5da6484cc5d4b5.9085987415711785728103.jpg */}

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

                    <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 50, backgroundColor: '#321357',
                                paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30,
                                display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                            Xác nhận nhận hàng
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </View>
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
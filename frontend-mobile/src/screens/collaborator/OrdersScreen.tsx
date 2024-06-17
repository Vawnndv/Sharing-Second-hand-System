import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl} from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import OrderComponent from "../../components/OrderCollaborator/OrderComponent";
import { useState } from "react";
import FilterModal from "../../modals/FilterModal";
import { appInfo } from "../../constants/appInfos";
import moment from "moment";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducers";
import { ContainerComponent, HeaderComponent } from "../../components";
import { LoadingModal } from "../../modals";
import { useFocusEffect } from "@react-navigation/native";
import ShowMapComponent from "../../components/ShowMapComponent";
import { appColors } from "../../constants/appColors";
import { fontFamilies } from "../../constants/fontFamilies";
import { Ionicons } from '@expo/vector-icons'
import { category } from "../../constants/appCategories";
import axiosClient from "../../apis/axiosClient";


export default function OrdersScreen({navigation}: any) {

    const [refreshing, setRefreshing] = useState(false)

    const auth = useSelector(authSelector)
    
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true)

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [tab, setTab] = useState('Chờ cộng tác viên lấy hàng')
    const [orders, setOrders] = useState([])
    const [ordersGiving, setOrdersGiving] = useState([])

    const [filterValue, setFilterValue] = useState({
        distance: -1,
        time: -1,
        category: category,
        sort: 'Mới nhất'
    })

    // console.log(filterValue)

    // dùng để load lại dữ liệu những order mà người dùng pick
    const [changeOrdersGiving, setChangeOrdersGiving] = useState(false)

    // load dữ liệu những order đang lấy
    useEffect(() => {
        const fetchAPI = async () => {
            try{
                setIsLoading(true)
                const response: any = await axiosClient.get(`${appInfo.BASE_URL}/ordersCollab?userID=${auth.id}&type=Hàng đang được đến lấy&distance=-1&time=-1&category=Tất cả&sort=Mới nhất`)
                setOrdersGiving(response.orders)
                setIsLoading(false)
            }catch(error){
                console.log(error)
            }
        }

        fetchAPI()
    },[changeOrdersGiving, refreshing])

    // thực hiện trả về order[] khi filterValue thay đổi
    

    // load dữ liệu những order có thể chọn
    useEffect(() => {
        const fetchAPI = async () => {
            try{
                let categoryQuery = ''
                if(filterValue.category.length < 7){
                    filterValue.category.map((item: any, index: number) => {
                        categoryQuery += item
                        if(index < filterValue.category.length - 1){
                            categoryQuery += ','
                        }
                    })
                }else{
                    categoryQuery = 'Tất cả'
                }
                console.log(filterValue.category.length, categoryQuery)
                setIsLoading(true)
                const response: any = await axiosClient.get(`${appInfo.BASE_URL}/ordersCollab?userID=${auth.id}&type=${tab}&distance=${filterValue.distance}
                    &time=${filterValue.time}&category=${categoryQuery}&sort=${filterValue.sort}`)
                setOrders(response.orders)
                setIsLoading(false)
            }catch(error){
                console.log(error)
            }
        }
        console.log("TAGGGGGGGGGGGGGGGGGGGGG", tab)
        fetchAPI()
    },[tab, filterValue, changeOrdersGiving, refreshing])

    const calculateDay = (dayAmount: number) => {
        if(dayAmount === -1){
            return 'Ngày hết hạn: ' + 'Tất cả'
        }
        const currentDay = new Date()
        let day = new Date(currentDay)
        day.setDate(currentDay.getDate() + dayAmount)
        const date = day.getDate() > 9 ? day.getDate() : '0'+day.getDate()
        const month = day.getMonth() > 9 ? (day.getMonth() + 1) : ('0'+(day.getMonth() + 1))
        return 'Ngày hết hạn: '+ date + '/' + month + '/' + day.getFullYear()
    }


    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //       // Thực hiện các hành động cần thiết khi màn hình được focus
    //       console.log('Home Screen Reloaded:');
    //       setRefresh(prevRefresh => !prevRefresh);
    //     });
    //     return unsubscribe;
    //   }, [navigation]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
    
        // Giả sử bạn load lại dữ liệu từ API
        setTimeout(() => {
          // Ví dụ này chỉ là load lại dữ liệu cũ, bạn có thể thay thế bằng API call
          setRefreshing(false);
        }, 1000);
      }, []);
    console.log(ordersGiving)
    return(
        <ContainerComponent>
            {/* <ShowMapComponent location={{latitude: 10.768879, longitude: 106.656034, address: 'Nhà thi đấu Phú Thọ'}} setLocation={''}/> */}
            <View style={[styles.container, {marginTop: 10}]}>
                <View style={styles.container}>

                    <View style={styles.wrapper}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={()=>{setTab('Chờ cộng tác viên lấy hàng')}}>
                                <Text style={[styles.defaultText, tab === 'Chờ cộng tác viên lấy hàng' ? styles.tabSelected : styles.defaultTab]}>
                                    Chờ lấy
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={()=>{setTab('Hàng đã nhập kho')}}>
                                <Text style={[styles.defaultText, tab === 'Hàng đã nhập kho' ? styles.tabSelected : styles.defaultTab, {marginLeft: 20}]}>
                                    Đã lấy
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={()=>{setTab('Chờ người cho giao hàng')}}>
                                <Text style={[styles.defaultText, tab === 'Chờ người cho giao hàng' ? styles.tabSelected : styles.defaultTab, {marginLeft: 20}]}>
                                    Người dùng mang đến
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <ScrollView style={[, {marginTop: 20}]}
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity style={styles.itemFilter}
                                onPress={showModal}>
                                <Ionicons name="options" size={26} color={'#552466'}/>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* // seperate */}
                    <View style={{height: 2, width: '100%', backgroundColor: appColors.gray5, marginTop: 10}}></View>

                    <View style={styles.wrapper}>
                        <Text style={{marginTop: 10, fontSize: 18, color: appColors.primary2, fontWeight: 'bold'}}>{calculateDay(filterValue.time)}  
                            {   
                                filterValue.time === 0 &&
                                ' ( Hôm nay )'
                            }
                        </Text>
                    </View>
                    {/* // seperate */}
                    <View style={{height: 2, width: '100%', backgroundColor: appColors.gray5, marginTop: 10
                    }}></View>

                    {/* <View style={{width: '100%', height: "100%", backgroundColor: '#EBEBEB',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'}}> */}
                        <ScrollView style={{width: '100%', height: "100%"}}
                            horizontal={false}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }>

                            {
                                ordersGiving.map((order: any, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => navigation.navigate('OrderDetailsScreen',  {
                                            orderID: order.orderID,
                                            status: order.status,
                                        })} key={index}
                                        style={{
                                            paddingHorizontal: 20,
                                            paddingBottom: 10
                                        }}>
                                            <OrderComponent
                                                avatar={order.giver.avatar}
                                                name={`${order.giver.firstName} ${order.giver.lastName}`}
                                                timeStart={moment(order.timeStart).format("DD-MM-YYYY")}
                                                timeEnd={moment(order.timeEnd).format("DD-MM-YYYY")}
                                                departure={order.addressGive.address}
                                                destination={order.addressReceive.address!==undefined ? order.addressReceive.address : ''}
                                                quantity={order.item.quantity}
                                                itemName={order.item.name}
                                                status={order.status}
                                                changeOrdersGiving={changeOrdersGiving}
                                                setChangeOrdersGiving={setChangeOrdersGiving}
                                                orderID={order.orderID}
                                                collboratorReceiveID={auth.id}
                                                imagePath={order.imagePath}
                                            />
                                        </TouchableOpacity>
                                    )
                                })
                            }

                            {
                                orders.map((order: any, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => navigation.navigate('OrderDetailsScreen',  {
                                            orderID: order.orderID,
                                            status: order.status,
                                        })} key={index}
                                        style={{
                                            paddingHorizontal: 20,
                                            paddingBottom: 10
                                        }}>
                                            <OrderComponent
                                                avatar={order.giver.avatar}
                                                name={`${order.giver.firstName} ${order.giver.lastName}`}
                                                timeStart={moment(order.timeStart).format("DD-MM-YYYY")}
                                                timeEnd={moment(order.timeEnd).format("DD-MM-YYYY")}
                                                departure={order.addressGive.address}
                                                destination={order.addressReceive.address!==undefined ? order.addressReceive.address : ''}
                                                quantity={order.item.quantity}
                                                itemName={order.item.name}
                                                status={order.status}
                                                changeOrdersGiving={changeOrdersGiving}
                                                setChangeOrdersGiving={setChangeOrdersGiving}
                                                orderID={order.orderID}
                                                collboratorReceiveID={auth.id}
                                                imagePath={order.imagePath}
                                            />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    

                </View>

                <FilterModal visible={visible} setVisible={setVisible} hideModal={hideModal} showModal={showModal} filterValue={filterValue} setFilterValue={setFilterValue}/>
                <LoadingModal visible={isLoading}/>
                
            {/* </View> */}
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
    wrapper: {
        width: '90%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    defaultText: {
        fontSize: 18,
    },
    itemFilter: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: appColors.white5,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
    },
    order: {
        backgroundColor: '#ECDDAE',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5, 
        marginTop: 10
    },
    orderInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    defaultTab: {
        color: appColors.gray5, 
        fontWeight: 'bold'
    },
    tabSelected: {
        color: appColors.primary2,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }
    
})
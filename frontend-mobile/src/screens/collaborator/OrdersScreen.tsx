import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import OrderComponent from "../../components/OrderCollaborator/OrderComponent";
import { useState } from "react";
import FilterModal from "../../modals/FilterModal";
import axios from "axios";
import { appInfo } from "../../constants/appInfos";
import moment from "moment";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducers";
import { ContainerComponent, HeaderComponent } from "../../components";
import { LoadingModal } from "../../modals";
import { useFocusEffect } from "@react-navigation/native";

export default function OrdersScreen({navigation}: any) {

    const [refresh, setRefresh] = useState(false)

    const auth = useSelector(authSelector)
    
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true)

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [tab, setTab] = useState('Chờ cộng tác viên lấy hàng')
    const [orders, setOrders] = useState([])
    const [ordersGiving, setOrdersGiving] = useState([])

    const [filterValue, setFilterValue] = useState({
        distance: 15,
        time: 1,
        category: "Tất cả",
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
                const response = await axios.get(`${appInfo.BASE_URL}/ordersCollab?userID=${auth.id}&type=Hàng đang được đến lấy&distance=Tất cả&time=Tất cả&category=Tất cả&sort=Mới nhất`)
                setOrdersGiving(response.data.orders)
                setIsLoading(false)
            }catch(error){
                console.log(error)
            }
        }

        fetchAPI()
    },[changeOrdersGiving, refresh, tab])

    // thực hiện trả về order[] khi filterValue thay đổi
    

    // load dữ liệu những order có thể chọn
    useEffect(() => {
        const fetchAPI = async () => {
            try{
                setIsLoading(true)
                const response = await axios.get(`${appInfo.BASE_URL}/ordersCollab?userID=${auth.id}&type=${tab}&distance=${filterValue.distance}
                    &time=${filterValue.time}&category=${filterValue.category}&sort=${filterValue.sort}`)
                setOrders(response.data.orders)
                setIsLoading(false)
            }catch(error){
                console.log(error)
            }
        }

        fetchAPI()
    },[tab, filterValue, changeOrdersGiving, refresh])

    const calculateDay = (dayAmount: number) => {
        const currentDay = new Date()
        let day = new Date(currentDay)
        day.setDate(currentDay.getDate() + dayAmount)
        const date = day.getDate() > 9 ? day.getDate() : '0'+day.getDate()
        const month = day.getMonth() > 9 ? (day.getMonth() + 1) : ('0'+(day.getMonth() + 1))
        return date + '/' + month + '/' + day.getFullYear()
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // Thực hiện các hành động cần thiết khi màn hình được focus
          console.log('Home Screen Reloaded:');
          setRefresh(prevRefresh => !prevRefresh);
          console.log(refresh)
        });
        return unsubscribe;
      }, [navigation]);

    return(
        <ContainerComponent right>
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

                        </View>

                        <ScrollView style={[, {marginTop: 20}]}
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity style={styles.itemFilter}
                                onPress={showModal}>
                                <IconFeather name="filter" size={20}/>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* // seperate */}
                    <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                    <View style={styles.wrapper}>
                        <Text style={{marginTop: 10, fontSize: 18, color: '#622B9D', fontWeight: 'bold'}}>Ngày {calculateDay(filterValue.time)} ( Hôm nay )</Text>
                    </View>
                    {/* // seperate */}
                    <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                    <ScrollView style={{width: '90%', marginTop: 10}}
                        horizontal={false}>

                        {
                            ordersGiving.map((order: any, index) => {
                                return (
                                    <TouchableOpacity onPress={() => navigation.navigate('OrderDetailsScreen',  {
                                        orderID: order.orderID,
                                        status: order.status,
                                    })} key={index}>
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
                                    })} key={index}>
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
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>



                </View>

                <FilterModal visible={visible} setVisible={setVisible} hideModal={hideModal} showModal={showModal} filterValue={filterValue} setFilterValue={setFilterValue}/>
                <LoadingModal visible={isLoading}/>
            </View>
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F7E2CD',
        borderRadius: 15,
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
        color: '#CCCCCC', 
        fontWeight: 'bold'
    },
    tabSelected: {
        color: '#622B9D',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }
    
})
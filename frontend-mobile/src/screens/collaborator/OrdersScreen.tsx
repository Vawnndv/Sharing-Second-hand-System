import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet} from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { ScrollView } from "react-native-gesture-handler";
import OrderComponent from "../../components/OrderCollaborator/OrderComponent";
import { useState } from "react";
import FilterModal from "../../modals/FilterModal";
import axios from "axios";
import { appInfo } from "../../constants/appInfos";
import moment from "moment";

export default function OrdersScreen({navigation}: any) {
    
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [tab, setTab] = useState('Pending')
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchAPI = async () => {
            try{
                const response = await axios.get(`${appInfo.BASE_URL}/ordersCollab?userID=31&type=${tab}`)
                // console.log(response.data.orders)
                setOrders(response.data.orders)
            }catch(error){
                console.log(error)
            }
        }

        fetchAPI()
    },[])
    return(
        // <View>
        //     <Text>
        //         Home Screen
        //     </Text>

        //     <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
        //         <Text>link to map</Text>
        //     </TouchableOpacity>

        //     <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
        //         <Text>link to orders</Text>
        //     </TouchableOpacity>
        // </View>
        <View style={styles.container}>
            <View style={styles.container}>

                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={()=>{setTab('Pending')}}>
                            <Text style={[styles.defaultText, tab === 'Pending' ? styles.tabSelected : styles.defaultTab]}>
                                Chờ lấy
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={()=>{setTab('Completed')}}>
                            <Text style={[styles.defaultText, tab === 'Completed' ? styles.tabSelected : styles.defaultTab, {marginLeft: 20}]}>
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
                    <Text style={{marginTop: 10, fontSize: 18, color: '#622B9D', fontWeight: 'bold'}}>Ngày 20/11/2024</Text>
                </View>
                {/* // seperate */}
                <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                <ScrollView style={{width: '90%', marginTop: 10}}
                    horizontal={false}>
                    {
                        orders.map((order: any, index) => {
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate('OrderDetailsScreen',  {
                                    orderID: order.orderID
                                  })} key={index}>
                                    <OrderComponent
                                        avatar={order.receiver.avatar}
                                        name={`${order.receiver.firstName} ${order.receiver.lastName}`}
                                        timeStart={moment(order.time).format("DD-MM-YYYY")}
                                        departure={order.location}
                                        destination={order.receiver.address}
                                        quantity={order.item.quantity}
                                        itemName={order.item.name}
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>



            </View>

            <FilterModal visible={visible} setVisible={setVisible} hideModal={hideModal} showModal={showModal}/>
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
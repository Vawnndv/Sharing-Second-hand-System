import React from "react";
import { View, Text, TouchableOpacity, StyleSheet} from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { ScrollView } from "react-native-gesture-handler";
import OrderComponent from "../../components/OrderCollaborator/OrderComponent";
import { useState } from "react";
import FilterModal from "../../modals/FilterModal";

export default function OrdersScreen({navigation}: any) {

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [indexGive, setIndexGive] = useState(0)


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
                            onPress={()=>{setIndexGive(0)}}>
                            <Text style={[styles.defaultText, indexGive === 0 ? styles.tabSelected : styles.defaultTab]}>
                                Chờ lấy
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={()=>{setIndexGive(1)}}>
                            <Text style={[styles.defaultText, indexGive === 1 ? styles.tabSelected : styles.defaultTab]}>
                                Đã lấy
                            </Text>
                        </TouchableOpacity>

                        <IconEvil name="search" size={25}/>
                        <IconEvil name="location" size={25}/>
                        <IconFeather name="menu" size={25}/>
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
                    <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
                        <OrderComponent
                            avatar='https://petzpark.com.au/cdn/shop/articles/Breeds_Thumbnails_4_1_800x.jpg?v=1638423816'
                            name='Julia'
                            timeStart='18/11/2024'
                            departure='Quận 5, Thành phố Hồ Chí Minh'
                            destination='Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh'
                            size='S'
                            weight={1}
                            itemName='Máy cắt cỏ'
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
                        <OrderComponent
                            avatar='https://petzpark.com.au/cdn/shop/articles/Breeds_Thumbnails_4_1_800x.jpg?v=1638423816'
                            name='Julia'
                            timeStart='18/11/2024'
                            departure='Quận 5, Thành phố Hồ Chí Minh'
                            destination='Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh'
                            size='S'
                            weight={1}
                            itemName='Máy cắt cỏ'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
                        <OrderComponent
                            avatar='https://petzpark.com.au/cdn/shop/articles/Breeds_Thumbnails_4_1_800x.jpg?v=1638423816'
                            name='Julia'
                            timeStart='18/11/2024'
                            departure='Quận 5, Thành phố Hồ Chí Minh'
                            destination='Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh'
                            size='S'
                            weight={1}
                            itemName='Máy cắt cỏ'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
                        <OrderComponent
                            avatar='https://petzpark.com.au/cdn/shop/articles/Breeds_Thumbnails_4_1_800x.jpg?v=1638423816'
                            name='Julia'
                            timeStart='18/11/2024'
                            departure='Quận 5, Thành phố Hồ Chí Minh'
                            destination='Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh'
                            size='S'
                            weight={1}
                            itemName='Máy cắt cỏ'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
                        <OrderComponent
                            avatar='https://petzpark.com.au/cdn/shop/articles/Breeds_Thumbnails_4_1_800x.jpg?v=1638423816'
                            name='Julia'
                            timeStart='18/11/2024'
                            departure='Quận 5, Thành phố Hồ Chí Minh'
                            destination='Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh'
                            size='S'
                            weight={1}
                            itemName='Máy cắt cỏ'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ViewOrders')}>
                        <OrderComponent
                            avatar='https://petzpark.com.au/cdn/shop/articles/Breeds_Thumbnails_4_1_800x.jpg?v=1638423816'
                            name='Julia'
                            timeStart='18/11/2024'
                            departure='Quận 5, Thành phố Hồ Chí Minh'
                            destination='Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành phố Hồ Chí Minh'
                            size='S'
                            weight={1}
                            itemName='Máy cắt cỏ'
                        />
                    </TouchableOpacity>
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
        marginTop: 10,
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
        justifyContent: 'space-between'
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
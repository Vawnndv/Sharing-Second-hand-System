import axios from "axios";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { appInfo } from "../../constants/appInfos";
import { appColors } from "../../constants/appColors";

interface OrderFunctionProbs {
    avatar: string,
    name: string,
    timeStart: string,
    timeEnd: string,
    departure: string,
    destination: string,
    quantity: string,
    itemName: string,
    status: string,
    changeOrdersGiving: boolean,
    setChangeOrdersGiving: any,
    orderID: string,
    collboratorReceiveID: string | null
}
const OrderComponent: React.FC<OrderFunctionProbs> = ({
    avatar,
    name,
    timeStart,
    timeEnd,
    departure,
    destination,
    quantity,
    itemName,
    status,
    changeOrdersGiving,
    setChangeOrdersGiving,
    orderID,
    collboratorReceiveID}) => {
    // Xây dựng và trả về JSX.Element tương ứng với thông tin của đơn hàng


        // const pinOrderhandle = async() => {
        //     const collabID = status === 'Chờ cộng tác viên lấy hàng' ? collboratorReceiveID : null
        //     const statusOrder = status === 'Chờ cộng tác viên lấy hàng' ? 'Hàng đang được đến lấy' : 'Chờ cộng tác viên lấy hàng'
        //     console.log(collabID, statusOrder)
        //     await axios.put(`${appInfo.BASE_URL}/updateStatusOrder/${orderID}`,{
        //         status: statusOrder
        //     });
        //     const response = await axios.put(`${appInfo.BASE_URL}/updatePinOrder/${orderID}`,{
        //         collaboratorReceiveID: collabID
        //     });
        //     console.log(response)
        //     if(response.data.statusPin === false){
        //         alert('Đơn hàng đã được người khác chọn!')
        //     }else{
        //         alert('Chọn đơn hàng thành công')
        //     }
        //     setChangeOrdersGiving(!changeOrdersGiving)
        // }

        return (
        <View style={[styles.order, {backgroundColor: status === 'Hàng đang được đến lấy' ? "#DAE2CF" : appColors.gray5}]}>

            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5, marginRight: 5}}>
                <Text style={{color: '#54C362', fontStyle: 'italic'}}>{status}</Text>
            </View>

            <View style={styles.orderInfo}>
                <Image
                    style={{width: 80, height: 80, borderRadius: 50}}
                    source={{
                    uri: `${avatar}`,
                    }}
                />

                <View style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>

                    <View style={{width: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: 5}}>

                        <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>

                            <View style= {{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Text style= {{ fontWeight: "bold", fontSize: 16}}>{name}</Text>
                                <IconEvil name="clock" size={20}
                                    style= {{ marginLeft: 10}}/>
                                <Text style= {{fontSize: 14}}>{timeStart}</Text>
                            </View>

                            { status!=='Hàng đã nhập kho' &&
                                <TouchableOpacity style= {{display: 'flex', flexDirection: 'row', alignItems: 'center'}}
                                    // onPress={()=>pinOrderhandle()}
                                    >
                                    {
                                        status === 'Hàng đang được đến lấy' &&
                                        <IconEntypo name="pin" size={20} color={'black'}/>
                                    }
                                    
                                </TouchableOpacity>
                            }
                            
                        </View>

                        <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <View style= {{ marginTop: 5, display: 'flex', flexDirection: 'row'}}>
                                <IconEvil name="location" size={20}/>
                                <Text style= {{fontSize: 14, marginLeft: 5}}>{departure}</Text>
                            </View>
                        </View>

                        <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <View style= {{ marginTop: 5, display: 'flex', flexDirection: 'row'}}>
                                <IconEvil name="location" size={20} color='red'/>
                                <Text style= {{fontSize: 14, marginLeft: 5}}>{destination}</Text>
                            </View>
                        </View>
                    </View>
                    
                </View>
            </View>

            <View style={styles.orderInfo}>
                <Image
                    style={{width: 80, height: 80}}
                    source={
                        require('../.../../../../assets/item.png')
                    }/>
                
                <View style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style= {{fontSize: 14, marginLeft: 5, fontWeight: 'bold'}}>Số lượng {quantity} - {itemName}</Text>
                    <IconEntypo name="chevron-right" size={25}/>
                </View>
            </View>

            <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5, marginRight: 5}}>
                <Text style={{color: '#C35454', fontStyle: 'italic'}}>Ngày hết hạn {timeEnd}</Text>
            </View>
        </View>
        );
  };


  const styles = StyleSheet.create({
    order: {
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
    
})

export default OrderComponent;
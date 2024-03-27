import { View, Image, StyleSheet, Text } from "react-native"
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconEvil from 'react-native-vector-icons/EvilIcons';

interface OrderFunctionProbs {
    avatar: string,
    name: string,
    timeStart: string,
    departure: string,
    destination: string,
    quantity: string,
    itemName: string
}
const OrderComponent: React.FC<OrderFunctionProbs> = ({avatar,
    name,
    timeStart,
    departure,
    destination,
    quantity,
    itemName}) => {
    // Xây dựng và trả về JSX.Element tương ứng với thông tin của đơn hàng
        return (
        <View style={styles.order}>
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

                            <View style= {{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <IconEntypo name="pin" size={20}/>
                            </View>
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
        </View>
        );
  };


  const styles = StyleSheet.create({
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
    
})

export default OrderComponent;
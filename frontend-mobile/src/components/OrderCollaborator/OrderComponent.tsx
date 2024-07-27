import axios from "axios";
import { View, Image, StyleSheet, Text, TouchableOpacity, Platform } from "react-native"
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { appInfo } from "../../constants/appInfos";
import { appColors } from "../../constants/appColors";
import TextComponent from "../TextComponent";
import React from "react";
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
    collboratorReceiveID: string | null,
    imagePath: string
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
    collboratorReceiveID,
    imagePath}) => {

        return (
        <View style={[styles.order, {backgroundColor: status === 'Hàng đang được đến lấy' ? "#E9FFE9" : appColors.white2}]}>

            <View style= {[styles.padding,{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5}]}>
                <Text style={{color: '#54C362', fontStyle: 'italic'}}>{status}</Text>
            </View>

            <View style={[styles.orderInfo, styles.padding]}>
                {
                    avatar ?
                    <Image
                        style={{width: 80, height: 80, borderRadius: 50}}
                        source={{
                        uri: `${avatar}`,
                        }}
                    /> : 
                    <Image
                        style={{width: 80, height: 80, borderRadius: 50}}
                        source={{
                        uri: `https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png`,
                        }}
                    />
                }
                

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
                            <View style= {{ marginTop: 5, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <IconEvil name="location" size={20}/>
                                {/* <Text style= {{fontSize: 14, marginLeft: 5}}>{departure}</Text> */}
                                <TextComponent numberOfLines={1} text={departure} />
                            </View>
                        </View>

                        <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <View style= {{ marginTop: 5, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <IconEvil name="location" size={20} color='red'/>
                                {/* <Text style= {{fontSize: 14, marginLeft: 5}}>{destination}</Text> */}
                                <TextComponent numberOfLines={1} text={destination} />
                            </View>
                        </View>
                    </View>
                    
                </View>
            </View>

            <View style={[styles.orderInfo, {marginTop: 5}]}>
                
                <View style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style= {{fontSize: 14, marginLeft: 10, fontWeight: 'bold'}}>{itemName} - Số lượng {quantity}</Text>
                    {/* <IconEntypo name="chevron-right" size={25}/> */}
                </View>
            </View>

            <View style= {[styles.padding, {display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: 5}]}>
                <Text style={{color: '#C35454', fontStyle: 'italic'}}>Ngày hết hạn {timeEnd}</Text>
            </View>

            <Image
                style={styles.image}
                source={{
                uri: imagePath,
                }}
            />
        </View>
        );
  };


  const styles = StyleSheet.create({
    padding: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    order: {
        marginTop: 5, 
        marginBottom: 5,
        borderRadius: 8,
        shadowColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.3)' : 'black',
        shadowOffset: {
        width: 12,
        height: 16,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
        overflow: 'hidden'
    },
    orderInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 180
    }
    
})

export default OrderComponent;
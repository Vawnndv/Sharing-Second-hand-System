import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import OrderComponent from "../../components/OrderCollaborator/OrderComponent";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { appInfo } from "../../constants/appInfos";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducers";
import { ContainerComponent } from "../../components";

const screenWidth = Dimensions.get('window').width;

export default function StatisticScreen({navigation}: any) {

    const auth = useSelector(authSelector)

    const [orderData, setOrderData] = useState([0,0])
    const [orders, setOrders] = useState([])

    const data = [
        { name: 'Hàng đã lấy', amount: orderData[0], color: '#FF6347', legendFontColor: '#7F7F7F', legendFontSize: 14 },
        { name: 'Hàng chưa lấy', amount: orderData[1], color: '#FFD700', legendFontColor: '#7F7F7F', legendFontSize: 14 },
    ];
      
      const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // màu của văn bản
        style: {
          borderRadius: 16,
        },
      };
      
      const LineChartExample = () => {
        return (
          <View>
            <PieChart
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </View>
        );
      };

    useEffect(() => {
        const fetchAPIOrders = async () => {
            try{
                const response = await axios.get(`${appInfo.BASE_URL}/statisticOrdersOnWeekCollab?userID=${auth.id}`)
                console.log(response.data.ordersOnWeek)
                setOrders(response.data.ordersOnWeek)
            }catch(error){
                console.log(error)
            }
        }

        const fetchAPIData = async () => {
            try{
                const response = await axios.get(`${appInfo.BASE_URL}/statisticOrderCollab?userID=${auth.id}`)
                // console.log(response.data.orders)
                setOrderData(response.data.statisticOrder)
            }catch(error){
                console.log(error)
            }
        }

        fetchAPIData()
        fetchAPIOrders()
    }, [])
    return(
        <ContainerComponent back>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={{backgroundColor: 'white'}}>
                        <LineChartExample/>
                    </View>
                    {/* // seperate */}
                    <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                    <View style={styles.content}>
                        <View>
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>Các đơn hàng trong tuần này</Text>
                        </View>

                        {
                            orders &&
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
                    </View>
                </View>
                
            </ScrollView>
        </ContainerComponent>
        
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:"center",
        width:'100%',
    },
    content: {
        width: '90%',
        marginTop: 10
    }
})
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
import { LoadingModal } from "../../modals";
import DropdownComponent from "../../components/DropdownComponent"

const screenWidth = Dimensions.get('window').width;

export default function StatisticScreen({navigation}: any) {

    const auth = useSelector(authSelector)

    const [orderData, setOrderData] = useState([0,0])
    const [orders, setOrders] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [tab, setTab] = useState('Chờ cộng tác viên lấy hàng')

    const [value, setValue] = useState<any>('14')

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
                const response = await axios.get(`${appInfo.BASE_URL}/ordersCollab?userID=${auth.id}
                &type=${tab}&distance=Tất cả&time=${value}&category=Tất cả&sort=Mới nhất`)
                setOrders(response.data.orders)
            }catch(error){
                console.log(error)
            }
        }

        const fetchAPIData = async () => {
            try{
                const response = await axios.get(`${appInfo.BASE_URL}/statisticOrderCollab?userID=${auth.id}&time=1 week`)
                // console.log(response.data.orders)
                setOrderData(response.data.statisticOrder)
            }catch(error){
                console.log(error)
            }
        }

        const fetchAPI = async () => {
            setIsLoading(true)
            await fetchAPIData()
            await fetchAPIOrders()
            setIsLoading(false)
        }

        fetchAPI()
    }, [value])

    useEffect(()  => {
        const fetchAPIOrders = async () => {
            setIsLoading(true)
            try{
                
                const response = await axios.get(`${appInfo.BASE_URL}/ordersCollab?userID=${auth.id}
                &type=${tab}&distance=Tất cả&time=${value}&category=Tất cả&sort=Mới nhất`)
                setOrders(response.data.orders)
                
            }catch(error){
                console.log(error)
            }
            setIsLoading(false)
        }
        
        fetchAPIOrders()
        
    }, [tab])

    

    const dataDropdown = [
        { label: '1 ngày', value: '1' },
        { label: '3 ngày', value: '3' },
        { label: '1 tuần', value: '7' },
        { label: '2 tuần', value: '14' },
        { label: '1 tháng', value: '30' },
        { label: '3 tháng', value: '90' },
    ]

    const [changeOrdersGiving, setChangeOrdersGiving] = useState(false)

    return(
        <ContainerComponent back>
            
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={{backgroundColor: 'white'}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 20}}>Thống kê</Text>
                        <DropdownComponent value={value} setValue={setValue} data={dataDropdown}/>
                        <LineChartExample/>
                    </View>
                    {/* // seperate */}
                    <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View>

                    <View style={styles.content}>
                        <View>
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>Các đơn hàng trong tuần này</Text>
                        </View>

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

                        {
                            orders &&
                            orders.map((order: any, index) => {
                                return (
                                    <TouchableOpacity onPress={() => navigation.navigate('OrderDetailsScreen',  {
                                        orderID: order.orderID
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
                    </View>
                </View>
                
            </ScrollView>

            <LoadingModal visible={isLoading}/>
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
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 10
    },
    defaultText: {
        fontSize: 15,
    },defaultTab: {
        color: '#CCCCCC', 
        fontWeight: 'bold'
    },
    tabSelected: {
        color: '#622B9D',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }
})
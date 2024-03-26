import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import OrderComponent from "../../components/OrderCollaborator/OrderComponent";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get('window').width;

const data = [
    { name: 'Hàng đã lấy', amount: 2000, color: '#FF6347', legendFontColor: '#7F7F7F', legendFontSize: 14 },
    { name: 'Hàng chưa lấy', amount: 4000, color: '#FFD700', legendFontColor: '#7F7F7F', legendFontSize: 14 },
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

export default function StatisticScreen({navigation}: any) {
    return(
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
                </View>
            </View>
            
        </ScrollView>
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
import { View, Image, StyleSheet, Text, Touchable, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { RadioButton } from 'react-native-paper';
import { useState } from "react";
import { Modal, Portal, PaperProvider } from 'react-native-paper';

export default function FilterComponent({hideModal}: any) {

    const [indexDistance, setIndexDistance] = useState(0)
    const [indexTime, setIndexTime] = useState(0)
    const [indexCategory, setIndexCategory] = useState(0)

    const [checked, setChecked] = useState('first');
    return (
        <View style={styles.container}>
           
            <View style={[{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}]}><Text style={[styles.textDefault, {fontWeight: 'bold', fontSize: 18}]}>Filter</Text></View>

            {/* // seperate */}
            <View style={{height: 2, width: '100%', backgroundColor: '#DFDFDF', marginTop: 10}}></View>

            <View style={styles.group}>
                <Text style={[styles.textDefault,{marginLeft: 10, fontWeight: 'bold'}]}>Khoảng cách</Text>
                
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={[styles.groupItem]}>
                        <TouchableOpacity style={[styles.item, indexDistance === 0 && styles.selectItem]}
                            onPress={() => {setIndexDistance(0)}}>
                            <Text style={[{fontSize: 15}, indexDistance === 0 && styles.selectTextItem]}>1 km</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexDistance === 1 && styles.selectItem]}
                            onPress={() => {setIndexDistance(1)}}>
                            <Text style={[{fontSize: 15}, indexDistance === 1 && styles.selectTextItem]}>2 km</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexDistance === 2 && styles.selectItem]}
                            onPress={() => {setIndexDistance(2)}}>
                            <Text style={[{fontSize: 15}, indexDistance === 2 && styles.selectTextItem]}>5 km</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexDistance === 3 && styles.selectItem]}
                            onPress={() => {setIndexDistance(3)}}>
                            <Text style={[{fontSize: 15}, indexDistance === 3 && styles.selectTextItem]}>10 km</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexDistance === 4 && styles.selectItem]}
                            onPress={() => {setIndexDistance(4)}}>
                            <Text style={[{fontSize: 15}, indexDistance === 4 && styles.selectTextItem]}>15 km</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexDistance === 5 && styles.selectItem]}
                            onPress={() => {setIndexDistance(5)}}>
                            <Text style={[{fontSize: 15}, indexDistance === 5 && styles.selectTextItem]}>25 km</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.group}>
                <Text style={[styles.textDefault,{marginLeft: 10, fontWeight: 'bold'}]}>Thời gian</Text>
                
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.groupItem}>
                        <TouchableOpacity style={[styles.item, indexTime === 0 && styles.selectItem]}
                            onPress={() => {setIndexTime(0)}}>
                            <Text style={[{fontSize: 15}, indexTime === 0 && styles.selectTextItem]}>1 ngày trước</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexTime === 1 && styles.selectItem]}
                            onPress={() => {setIndexTime(1)}}>
                            <Text style={[{fontSize: 15}, indexTime === 1 && styles.selectTextItem]}>3 ngày trước</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexTime === 2 && styles.selectItem]}
                            onPress={() => {setIndexTime(2)}}>
                            <Text style={[{fontSize: 15}, indexTime === 2 && styles.selectTextItem]}>1 tuần trước</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexTime === 3 && styles.selectItem]}
                            onPress={() => {setIndexTime(3)}}>
                            <Text style={[{fontSize: 15}, indexTime === 3 && styles.selectTextItem]}>2 tuần trước</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexTime === 4 && styles.selectItem]}
                            onPress={() => {setIndexTime(4)}}>
                            <Text style={[{fontSize: 15}, indexTime === 4 && styles.selectTextItem]}>1 tháng trước</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.group}>
                <Text style={[styles.textDefault,{marginLeft: 10, fontWeight: 'bold'}]}>Doanh mục</Text>
                
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.groupItem}>
                        <TouchableOpacity style={[styles.item, indexCategory === 0 && styles.selectItem]}
                            onPress={() => {setIndexCategory(0)}}>
                            <Text style={[{fontSize: 15}, indexCategory === 0 && styles.selectTextItem]}>Quần áo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexCategory === 1 && styles.selectItem]}
                            onPress={() => {setIndexCategory(1)}}>
                            <Text style={[{fontSize: 15}, indexCategory === 1 && styles.selectTextItem]}>Giày dép</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexCategory === 2 && styles.selectItem]}
                            onPress={() => {setIndexCategory(2)}}>
                            <Text style={[{fontSize: 15}, indexCategory === 2 && styles.selectTextItem]}>Đồ nội thất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexCategory === 3 && styles.selectItem]}
                            onPress={() => {setIndexCategory(3)}}>
                            <Text style={[{fontSize: 15}, indexCategory === 3 && styles.selectTextItem]}>Công cụ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexCategory === 4 && styles.selectItem]}
                            onPress={() => {setIndexCategory(4)}}>
                            <Text style={[{fontSize: 15}, indexCategory === 4 && styles.selectTextItem]}>Dụng cụ học tập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, indexCategory === 5 && styles.selectItem]}
                            onPress={() => {setIndexCategory(5)}}>
                            <Text style={[{fontSize: 15}, indexCategory === 5 && styles.selectTextItem]}>Thể thao</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.group}>
                <Text style={[styles.textDefault,{marginLeft: 10, fontWeight: 'bold'}]}>Sắp xếp theo</Text>
                
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.groupItem}>
                        <TouchableOpacity style={[styles.item, {display: 'flex', flexDirection: 'row', alignItems: 'center'}]}
                            onPress={() => setChecked('first')}>
                            <RadioButton
                                value="first"
                                status={ checked === 'first' ? 'checked' : 'unchecked' }
                            />
                            <Text>Mới nhất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.item, {display: 'flex', flexDirection: 'row', alignItems: 'center'}]}
                            onPress={() => setChecked('second')}>
                            <RadioButton
                                value="second"
                                status={ checked === 'second' ? 'checked' : 'unchecked' }
                            />
                            <Text>Gần nhất</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.button}>
                <TouchableOpacity style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    onPress={hideModal}>
                    <Text style={{color: 'white'}}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0
    },
    textDefault: {
        fontSize: 15
    },
    group: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20
    },
    groupItem: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        
    },
    item: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#EEEEEE',
        marginHorizontal: 10
    },
    selectItem: {
        backgroundColor: '#782292',
    },
    selectTextItem: {
        color: 'white'
    },
    button: {
        marginVertical:20,
        marginHorizontal: 10,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 200,
        backgroundColor: '#782292'
    }
})
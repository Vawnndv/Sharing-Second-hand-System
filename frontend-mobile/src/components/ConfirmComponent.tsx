import { Button, StyleSheet, TouchableOpacity } from "react-native";
import { Modal, Text, View } from "react-native";

export default function ConfirmComponent({visible, setVisible, title, setConfirm, setIsLoading}: any) {
    
    return (

            <Modal
            animationType="slide"
            transparent={true}
            visible={visible}>
                <View style={styles.container}>
                    <View style={styles.modalView}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                            {title}
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => setVisible(false)}
                                style={[styles.button, {backgroundColor: '#C62D46'}]}>
                                <Text style={{color: 'white'}}>
                                    Không
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {setVisible(false), setConfirm(true), setIsLoading(true)}}
                                style={[styles.button, {backgroundColor: '#26983F'}]}>
                                <Text style={{color: 'white'}}>
                                    Có
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
                
                
            </Modal>

        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        opacity: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        width: '80%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        opacity: 500
    },
    buttonContainer: {
        width: '100%', 
        display: 'flex',
        flexDirection: 'row', 
        marginTop: 20,
        justifyContent: 'space-around'
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10
    }
})
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ContainerComponent, SectionComponent } from '../../components'
import { Ionicons } from '@expo/vector-icons';
import { appInfo } from '../../constants/appInfos';

export default function ScanScreen({navigation} : any) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data } : any) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Đang yêu cầu quyền cho Camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Không truy cập được Camera</Text>;
  }

  return (
    <View style={{flex: 1, paddingTop: 36}}>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{...StyleSheet.absoluteFillObject, flex: 1}}
        />
        {scanned && <Button title={'Chạm để quét lại lần nữa'} onPress={() => setScanned(false)} />}
        {/* <View style={styles.marker}/> */}
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          style={{ paddingTop: 30, paddingLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ImageBackground
              source={require('../../../assets/images/scanner.png')}
              style={{width: 250, height: 250}}
          >
          </ImageBackground>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  marker: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    width: 200,
    height: 200,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    zIndex: 1, // Ensure the marker is above the camera preview
  },
});

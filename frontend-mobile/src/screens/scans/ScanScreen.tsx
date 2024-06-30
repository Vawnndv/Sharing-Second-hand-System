import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ImageBackground,
} from "react-native";
import { Camera, CameraType, BarCodeScanningResult } from "expo-camera";
import { ContainerComponent } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import orderAPI from "../../apis/orderApi";
import { LoadingModal } from "../../modals";
import { IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducers";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

type ScanScreenProps = {
  navigation: any;
  route: any;
};

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [orderID, setOrderID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);

  const auth = useSelector(authSelector);
  const userID = auth?.id;

  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, [])
  );

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const verifyQRCode = async ({ data }: { data: string }) => {
    try {
      const res = await orderAPI.HandleOrder(
        `/verifyOrderQR?orderID=${data}`,
        "get"
      );
      if (!res.data) {
        alert(`Không tìm thấy bài đăng hay đơn hàng của bạn`);
      } else if (res.data.userreceiveid === userID || res.data.usergiveid === userID) {
        setOrderID(data);
        setIsLoading(false);
        navigation.navigate("ViewDetailOrder", { orderid: data });
      } else {
        navigation.navigate("ItemDetailScreen", {
          postID: res.data.postid,
        });
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Không tìm thấy bài đăng hay đơn hàng của bạn`);
    }
  };

  const handleBarCodeScanned = ({ type, data }: BarCodeScanningResult) => {
    setScanned(true);
    setIsLoading(true);
    verifyQRCode({ data });
  };

  return (
    <ContainerComponent>
      <View style={styles.container}>
        {isFocused && (
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            type={isFrontCamera ? CameraType.front : CameraType.back}
          />
        )}
        {scanned && (
          <Button
            title={"Chạm để quét lại lần nữa"}
            onPress={() => setScanned(false)}
          />
        )}
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          style={{ paddingTop: 30, paddingLeft: 10 }}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ImageBackground
            source={require("../../../assets/images/scanner.png")}
            style={{ width: 250, height: 250 }}
          />
        </View>
        <View style={{ paddingBottom: 20, paddingHorizontal: 20 }}>
          <IconButton
            style={{ marginVertical: 10 }}
            iconColor="#fff"
            size={40}
            icon="autorenew"
            mode="outlined"
            onPress={() => {
              setIsFrontCamera(!isFrontCamera);
            }}
          />
        </View>
      </View>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  marker: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    width: 200,
    height: 200,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -100 }],
    zIndex: 1, // Ensure the marker is above the camera preview
  },
});

export default ScanScreen;

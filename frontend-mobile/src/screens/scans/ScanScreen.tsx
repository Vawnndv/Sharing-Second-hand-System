import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ImageBackground,
  Modal,
} from "react-native";
import { CameraView, Camera } from "expo-camera/next";
import { ContainerComponent, SectionComponent } from "../../components";
import { Ionicons } from "@expo/vector-icons";
import { appInfo } from "../../constants/appInfos";
import orderAPI from "../../apis/orderApi";
import { LoadingModal } from "../../modals";
import { IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducers";
import { useFocusEffect } from "@react-navigation/native";

export default function ScanScreen({ navigation, route }: any) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);
  const [orderID, setOrderID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  const auth = useSelector(authSelector);
  const userID = auth.id;

  useFocusEffect(
    React.useCallback(() => {
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

  const verifyQRCode = async ({ data }: any) => {
    try {
      const res = await orderAPI.HandleOrder(
        `/verifyOrderQR?orderID=${data}`,
        "get"
      );
      if (res.data == null) {
        alert(`Không tìm thấy bài đăng hay đơn hàng của bạn`);
      } else if (
        res.data.userreceiveid === userID ||
        res.data.usergiveid === userID
      ) {
        setOrderID(data);
        setIsLoading(false);
        navigation.navigate("ViewDetailOrder", { orderid: data });
      } else {
        navigation.navigate("ItemDetailScreen", {
          postId: res.data.postid,
        });
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Không tìm thấy bài đăng hay đơn hàng của bạn`);
    }
  };

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    setIsLoading(true);
    verifyQRCode({ data });
  };

  if (hasPermission === null) {
    return <Text>Đang yêu cầu quyền cho Camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Không truy cập được Camera</Text>;
  }

  return (
    <ContainerComponent>
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
          facing={isFrontCamera ? "front" : "back"}
        />
        {scanned && (
          <Button
            title={"Chạm để quét lại lần nữa"}
            onPress={() => setScanned(false)}
          />
        )}
        {/* <View style={styles.marker}/> */}
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
          ></ImageBackground>
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
          ></IconButton>
        </View>
      </View>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
}

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

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { appColors } from "../../constants/appColors";
import { fontFamilies } from "../../constants/fontFamilies";
import TextComponent from "../TextComponent";

const { width } = Dimensions.get("window");

export default function CardOrderView({
  navigation,
  title,
  location,
  givetype,
  statusname,
  image,
  status,
  orderid,
}: any) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ViewDetailOrder", { orderid: orderid });
        }}
      >
        <View style={styles.card}>
          <View style={styles.content}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            <View style={styles.information}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.locationContainer}>
                <SimpleLineIcons name="location-pin" size={14} color={appColors.black} />
                <TextComponent numberOfLines={1} text={location}></TextComponent>
              </View>
              <View style={styles.methodContainer}>
                <Text style={styles.boldText}>Phương thức: </Text>
                <Text>{givetype}</Text>
              </View>
              <Text style={styles.statusText}>{statusname}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 130, // hoặc bất kỳ chiều cao nào bạn muốn
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: "2%",
    width: "96%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 130,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  information: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: "bold",
    fontFamily: fontFamilies.bold,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  locationContainer: {
    paddingTop: 2,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
  },
  location: {
    paddingLeft: 10,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  methodContainer: {
    paddingTop: 2,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
  },
  boldText: {
    fontWeight: "bold",
  },
  statusText: {
    textAlign: "right",
    color: "red",
    marginBottom: 10,
    marginRight: 10,
    flexWrap: 'wrap',
  },
});

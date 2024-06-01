import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconA from "react-native-vector-icons/AntDesign";
import { Pressable } from "react-native";
import ViewDetailOrder from "../../modals/ViewDetailOrder";
import { fontFamilies } from "../../constants/fontFamilies";
import { SimpleLineIcons } from "@expo/vector-icons";
import { appColors } from "../../constants/appColors";

const { width, height } = Dimensions.get("window");

export default function CardPostView({
  navigation,
  title,
  location,
  givetype,
  statusname,
  image,
  postid,
  isNavigatePostManager,
}: any) {
  const handleNavigate = () => {
    if (isNavigatePostManager) {
      navigation.navigate("ViewPostManagement", {
        title: title,
        location: location,
        givetype: givetype,
        statusname: statusname,
        image: image,
        postid: postid,
      });
    } else {
      navigation.navigate("ItemDetailScreen", {
        postId: postid,
      });
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => handleNavigate()}
      >
        <View style={styles.card}>
          <View style={styles.content}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            <View style={styles.information}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.locationContainer}>
                <SimpleLineIcons name="location-pin" size={14} color={appColors.black} />
                <Text style={styles.location}>{location}</Text>
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
    width: 120,
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

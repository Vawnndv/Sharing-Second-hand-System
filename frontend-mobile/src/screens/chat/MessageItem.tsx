import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { appColors } from "../../constants/appColors";
import ImageComponent from "./ImageComponent";
import CardPostMessageComponent from "./CardPostMessageComponent";
import { format } from "date-fns";

const MessageItem = ({ route, navigation, message, currentUser }: any) => {
  const createdAt = message?.createdAt?.toDate
    ? message.createdAt.toDate()
    : new Date();
  const formattedTime = format(createdAt, "MM/dd/yyyy HH:mm");
  if (currentUser?.id == message?.userid) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginVertical: 5,
          marginRight: 10,
        }}
      >
        <View>
          {message?.type == "image" ? (
            <View style={{ display: "flex", alignItems: "flex-end" }}>
              <ImageComponent uri={message?.text} />
              <Text style={{ fontSize: hp(1.5), padding: 5 }}>
                {formattedTime}
              </Text>
            </View>
          ) : message?.type == "post" ? (
            <CardPostMessageComponent
              route={route}
              navigation={navigation}
              uri={message?.uri}
              title={message?.title}
              postid={message?.postid}
            />
          ) : (
            <>
              <View
                style={{
                  paddingHorizontal: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: 5,
                  backgroundColor: appColors.white,
                }}
              >
                <Text style={{ fontSize: hp(2.5), padding: 5 }}>
                  {message?.text}
                </Text>
              </View>
              <View style={{ display: "flex", alignItems: "flex-end" }}>
                <Text style={{ fontSize: hp(1.5), padding: 5 }}>
                  {formattedTime}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 5,
          marginLeft: 10,
        }}
      >
        <View>
          {message?.type == "image" ? (
            <View>
              <ImageComponent uri={message?.text} />
              <Text style={{ fontSize: hp(1.5), padding: 5 }}>
                {formattedTime}
              </Text>
            </View>
          ) : message?.type == "post" ? (
            <CardPostMessageComponent
              route={route}
              navigation={navigation}
              uri={message?.uri}
              title={message?.title}
              postid={message?.postid}
            />
          ) : (
            <>
              <View
                style={{
                  paddingHorizontal: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  borderRadius: 5,
                  backgroundColor: appColors.gray4,
                }}
              >
                <Text style={{ fontSize: hp(2.5), padding: 5, color: "white" }}>
                  {message?.text}
                </Text>
              </View>
              <Text style={{ fontSize: hp(1.5), padding: 5 }}>
                {formattedTime}
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }
};

export default MessageItem;

const styles = StyleSheet.create({});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconA from 'react-native-vector-icons/AntDesign';
import { Pressable } from 'react-native';
import ViewDetailOrder from '../../modals/ViewDetailOrder';

const CardOrderView: React.FC<{ title: string, locationgive: string, givetype: string, status: string, image: string }> = ({ title, locationgive, givetype, status, image }) => {
  // const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => {
          // router.navigate({
          //   pathname: "/(modals)/ViewDetailOrder",
          //   params: {
          //     Title: Title,
          //     LocationGive: LocationGive,
          //     GiveType: GiveType,
          //     Status: Status,
          //     image: image
          //   },
          // });

          setIsModalVisible(true)
        }}
      >
        <View style={styles.card}>
            <View style={styles.content}>
            <Image
                source={{ uri: image }} 
                style={styles.image} 
                resizeMode="contain"
            />

            <View style={styles.infomation}>
                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
                <View style={{ paddingTop: 2, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="map-pin" size={20} color="#552466" />
                    <Text style={{ paddingLeft: 20 }}>{locationgive}</Text>
                </View>

                <View style={{ paddingTop: 2, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                    <IconA name="profile" size={20} color="#552466" />
                    <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}> Phương thức: </Text>
                    <Text> {givetype} </Text>
                </View>
            </View>
            </View>

            <Text style={{ textAlign: 'right', color: 'red'}}> {status} </Text>
        </View>
      </Pressable>

      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <ViewDetailOrder 
          setIsModalVisible={setIsModalVisible} 
          data={{
            title: title,
            locationgive: locationgive,
            givetype: givetype,
            status: status,
            image: image
          }} 
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 140,
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    borderColor: 'grey',
  },
  content: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    objectFit: 'cover',
    borderRadius: 5,
    marginHorizontal: 5
  },
  infomation: {
    height: 80,
    width: '70%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default CardOrderView;

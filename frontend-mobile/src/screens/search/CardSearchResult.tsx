import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

interface DataItem {
  id: string;
  imageUri: string;
  title: string;
  authorAvatarUri: string;
  authorName: string;
  distance: string;
  addedRecently: boolean;
}

interface Props {
  data: DataItem[];
}

const CardSearchResult: React.FC<Props> = ({ data }) => {
  return (
    <ScrollView>
      {data.map(item => (
        <View key={item.id} style={styles.container}>
          <TouchableOpacity style={styles.card}>
            <Image style={styles.cardImage} source={{ uri: item.imageUri }} />

            <View style={styles.infomation}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Avatar.Image size={24} source={{ uri: item.authorAvatarUri }} />
                <Text>{item.authorName}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Icon name="map-pin" size={20} color="#552466" />
                <Text>{item.distance}</Text>
                {item.addedRecently && <Text style={{ color: 'red', fontStyle: 'italic' }}> Vừa thêm vào </Text>}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )
}

export default CardSearchResult;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  cardText: {
    fontSize: 14
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    marginHorizontal: '2%',
    width: '96%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    borderRadius: 10
  },
  cardImage: {
    width: '30%',
    height: 100,
    resizeMode: 'cover',
    borderBottomLeftRadius: 10
  },
  infomation: {
    paddingLeft: 10,
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

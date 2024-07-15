import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { appInfo } from '../../constants/appInfos';

const SearchFilter = ({navigation, data, searchQuery, setSearchQuery} : any) => {

  return (
    <View style={styles.container}>
      <FlatList 
        style={{height: appInfo.sizes.HEIGHT - appInfo.sizes.HEIGHT * 0.2}}
        data={data}
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        renderItem={({item}) => {
          if(searchQuery === "") {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchResultScreen', { searchQuery: item.keyword })}>
                <View style={styles.item}>
                  <Text style={styles.key}>{item.keyword}</Text>
                  <Text style={styles.separate}></Text>
                </View>
              </TouchableOpacity>
            )
          }

          if(item.keyword.toLowerCase().includes(searchQuery.toLowerCase())) {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchResultScreen', { searchQuery: item.keyword })}>
                <View style={styles.item}>
                  <Text style={styles.key}>{item.keyword}</Text>
                  <Text style={styles.separate}></Text>
                </View>
              </TouchableOpacity>
            )
          }

          return null;
      }}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
    flexGrow: 1
  },
  item: {
    marginVertical: 10
  },
  key: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  separate: {
    borderColor: 'gray',
    borderTopWidth: 1,
    height: 1,
    marginTop: 5
  }
});


export default SearchFilter;

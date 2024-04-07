import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../../modals/FilterModal';
import React, { useState } from 'react';
import { Chip } from 'react-native-paper';

export default function FilterSearch({filterValue, setFilterValue, isPosts, setIsPosts}: any) {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.filter}>
      <TouchableOpacity 
        onPress={showModal}
      >
        <Ionicons name="options" size={26} color={'#552466'}/>
      </TouchableOpacity>

      <View style={styles.chip}> 
        <Chip
          selected={isPosts}
          showSelectedCheck={isPosts}
          onPress={() => setIsPosts(!isPosts)}
          mode="outlined"
          selectedColor= "#552466"
          style={{borderRadius: 30, backgroundColor: 'transparent', borderColor: isPosts ? '#552466' : '#fff'}}> 
          Bài đăng 
        </Chip> 
      </View>

      <View style={styles.chip}> 
        <Chip
          selected={!isPosts}
          showSelectedCheck={!isPosts}
          onPress={() => setIsPosts(!isPosts)}
          mode="outlined"
          selectedColor= "#552466"
          style={{borderRadius: 30, backgroundColor: 'transparent', borderColor: !isPosts ? '#552466' : '#fff'}}> 
          Lưu kho
        </Chip> 
      </View> 
      
      <FilterModal visible={visible} setVisible={setVisible} hideModal={hideModal} showModal={showModal}  filterValue={filterValue} setFilterValue={setFilterValue}/>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    height: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    margin: 10
  },
  chip: { 
    // flex: 1
  }, 
});
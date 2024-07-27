import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../../modals/FilterModal';
import React, { useState } from 'react';
import { appColors } from '../../constants/appColors';


export default function FilterOrder({filterValue, setFilterValue}: any) {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <TouchableOpacity 
        style={styles.filter}
        onPress={showModal}
      >
        <Ionicons name="options" size={26} color={appColors.primary}/>
      </TouchableOpacity>

      <FilterModal visible={visible} setVisible={setVisible} hideModal={hideModal} showModal={showModal} filterValue={filterValue} setFilterValue={setFilterValue}/>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {

    paddingVertical: 5, 
    paddingHorizontal: 20, 
    backgroundColor: appColors.white5, 
    borderRadius: 15
  }
});
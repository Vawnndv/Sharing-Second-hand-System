import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../../modals/FilterModal';
import React, { useState } from 'react';


export default function FilterOrder() {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.filter}>
      <TouchableOpacity 
        // onPress={() => {
        //   router.navigate({
        //     pathname: "/(modals)/FilterOrder",
        //     params: {
        //     },
        //   });
        // }}
        onPress={showModal}
      >
        <Ionicons name="options" size={26} color={'#552466'}/>
      </TouchableOpacity>

      <FilterModal visible={visible} setVisible={setVisible} hideModal={hideModal} showModal={showModal}/>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    height: 40,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 20
  }
});
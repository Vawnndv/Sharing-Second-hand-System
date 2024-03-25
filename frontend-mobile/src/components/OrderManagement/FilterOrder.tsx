import { StyleSheet, TouchableOpacity, View } from 'react-native';
// import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function FilterOrder() {
  // const router = useRouter();

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
      >
        <Ionicons name="options" size={26} color={'#552466'}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    height: 40,
    backgroundColor: '#f1f1f1',
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 20
  }
});
import { Dimensions } from "react-native";
import { BASE_URL } from "@env";

console.log('_BASE_URL__', BASE_URL)

export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  
  // BASE_URL: BASE_URL,
  BASE_URL: 'http://172.16.1.213:3000',
}

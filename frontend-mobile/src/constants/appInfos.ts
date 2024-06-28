import { Dimensions } from "react-native";
import { BASE_URL } from "@env";

console.log('_BA_S_E_URL________', BASE_URL)

export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  
  BASE_URL: BASE_URL,
  // BASE_URL:'http://192.168.239.83:8080',

}

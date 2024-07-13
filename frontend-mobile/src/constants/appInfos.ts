import { Dimensions } from "react-native";
import { BASE_URL } from "@env";

console.log('_BA_S_E_URL______', BASE_URL)

export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  
  // BASE_URL: BASE_URL
  BASE_URL:'http://192.168.238.246:8080',

}

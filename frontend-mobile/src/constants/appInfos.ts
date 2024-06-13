import { Dimensions } from "react-native";
import { BASE_URL, REACT_APP_FIREBASE_STORAGE_BUCKET  } from "@env";

console.log('_BASE___URL_', BASE_URL)

console.log('firebassssassaas', REACT_APP_FIREBASE_STORAGE_BUCKET)

export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  
  BASE_URL: BASE_URL,
  // BASE_URL:'http://192.168.93.83:3000',

}

import { Dimensions } from "react-native";
import { BASE_URL } from "@env";

export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  
  BASE_URL: 'http://192.168.1.3:8080'
}

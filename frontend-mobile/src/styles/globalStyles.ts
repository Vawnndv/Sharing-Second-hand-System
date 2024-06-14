import { Platform, StyleSheet } from 'react-native'
import { appColors } from '../constants/appColors'
import { fontFamilies } from '../constants/fontFamilies'

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },

  text: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: appColors.text,
  },

  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
  },

  shadow: {
    shadowColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  
  section: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  col: {
    flex: 1,
    flexDirection: 'column'
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D56F0',
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    borderRadius: 12,
    backgroundColor: appColors.white,
    marginHorizontal: 12,
    marginVertical: 6,
    marginBottom: 25,
  },

  bottomCard: {
    marginHorizontal: -12,
    marginBottom: -12,
    padding: 12,
    borderBottomLeftRadius: 12, 
    borderBottomRightRadius: 12, 
    backgroundColor: appColors.white5,
    shadowColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  }
});

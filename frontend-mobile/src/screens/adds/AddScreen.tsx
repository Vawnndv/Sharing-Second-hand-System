import { View, Text } from 'react-native'
import React from 'react'
import MultiStepForm from '../../components/PostForm/MultiStepForm';


const AddScreen = ({navigation} : any) => {
  return (
    <View>
      <MultiStepForm></MultiStepForm>
    </View>
  )
}

export default AddScreen
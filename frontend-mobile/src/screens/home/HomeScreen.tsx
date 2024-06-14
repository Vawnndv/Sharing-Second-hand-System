import React from 'react'
import { ContainerComponent } from '../../components'
import ItemTabComponent from './components/ItemTabComponent'

const HomeScreen = ({navigation} : any) => {
  return (
    <ContainerComponent right>
      <ItemTabComponent navigation={navigation}/>
    </ContainerComponent>
  )
}

export default HomeScreen
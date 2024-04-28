import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import FavoritesManagementScreen from './FavoritesManagementScreen'

const FavoritesScreen = () => {
  return (
    <ContainerComponent back title='Bài viết quan tâm'>
      <FavoritesManagementScreen/>
    </ContainerComponent>
  )
}

export default FavoritesScreen
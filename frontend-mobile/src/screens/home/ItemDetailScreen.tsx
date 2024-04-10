import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent } from '../../components'
import PostDetail from '../../components/PostDetail';


const ItemDetailScreen = () => {
  const postID = 53;

  return (
    <ContainerComponent isScroll title='Notification Screen' right back>
      <SectionComponent>
        <PostDetail postID={postID}/>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default ItemDetailScreen
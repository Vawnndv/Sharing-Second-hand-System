import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent } from '../../components'
import PostDetail from '../../components/PostDetail';


const ItemDetailScreen = ({navigation, route}: any) => {
  console.log(route.params)
  const postID = route.params.postId;
  console.log(postID)

  return (
    <ContainerComponent isScroll back>
      {/* <SectionComponent> */}
        <PostDetail postID={postID}/>
      {/* </SectionComponent> */}
    </ContainerComponent>
  )
}

export default ItemDetailScreen
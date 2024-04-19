import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent } from '../../components'
import PostDetail from '../../components/PostDetail';


const ItemDetailScreen = ({navigation, route}: any) => {
  console.log(route.params)
  const postID = route.params.postId;
  // const postID = 53;

  // console.log(postID)

  return (
    <ContainerComponent title='Bài đăng' isScroll back>
      {/* <SectionComponent> */}
        <PostDetail navigation={navigation} route={route} postID={postID}/>
      {/* </SectionComponent> */}
    </ContainerComponent>
  )
}

export default ItemDetailScreen
import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent } from '../../components'
import PostDetail from '../../components/PostDetail';


const ItemDetailScreen = ({navigation, route}: any) => {
  const postID = route.params.postID;
  return (
    <ContainerComponent title='Bài đăng' isScroll back>
      {/* <SectionComponent> */}
        <PostDetail navigation={navigation} route={route} postID={postID}/>
        {/* <Text>Hello: {postID}</Text> */}
      {/* </SectionComponent> */}
    </ContainerComponent>
  )
}

export default ItemDetailScreen
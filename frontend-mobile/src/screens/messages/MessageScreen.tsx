import React, { useState } from 'react'
import { Text } from 'react-native'
import { ContainerComponent, HeaderComponent, SectionComponent } from '../../components'
import PostDetail from '../../components/PostDetail'

const MessageScreen = () => {
  const [postID, setPostID] = useState(5);

  return (
    <ContainerComponent isScroll title='Message Screen' right>
      <SectionComponent>
        <PostDetail postID={postID}/>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default MessageScreen
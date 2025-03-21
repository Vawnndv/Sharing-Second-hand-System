import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent } from '../../components'
import {ThankYou} from '../../components/ThankYouComponent';


const ThankYouScreen = ({navigation, route}: any) => {
  const { title, isShowButton1, isShowButton2, titleButton1, titleButton2, linkForButton1, linkForButton2, postID, content } = route.params;

  return (
    <ContainerComponent >
      {/* <SectionComponent> */}
      <ThankYou title={title} isShowButton1 = {isShowButton1} isShowButton2={isShowButton2} titleButton1= {titleButton1} titleButton2={titleButton2} linkForButton1={linkForButton1} linkForButton2={linkForButton2} postID={postID} content={content}/>
      {/* </SectionComponent> */}
    </ContainerComponent>
  )
}

export default ThankYouScreen;
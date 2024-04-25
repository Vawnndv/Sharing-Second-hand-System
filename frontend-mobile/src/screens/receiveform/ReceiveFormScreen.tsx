import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent } from '../../components'
import {ReceiveForm} from '../../components/ReceiveForm/ReceiveForm';


const ReceiveFormScreen = ({navigation, route}: any) => {
  const { postID, receiveid, receivetype, receivetypeid, warehouseid } = route.params;

  return (
    <ContainerComponent title='Xác nhận' isScroll back>
      {/* <SectionComponent> */}
      <ReceiveForm navigation={navigation} route={route} postID={postID} receiveid={receiveid} receivetype={receivetype} receivetypeid={receivetypeid} warehouseid={warehouseid}/>
      {/* </SectionComponent> */}
    </ContainerComponent>
  )
}

export default ReceiveFormScreen;
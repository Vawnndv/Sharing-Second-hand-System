import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import OrderManagementScreen from './OrderManagementScreen'

const OrderScreen = () => {
  return (
    <ContainerComponent isImageBackground isScroll>
      <HeaderComponent />
      <OrderManagementScreen/>
    </ContainerComponent>
  )
}

export default OrderScreen
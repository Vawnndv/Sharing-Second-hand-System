import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import OrderManagementScreen from './OrderManagementScreen'

const OrderScreen = () => {
  return (
    <ContainerComponent isScroll>
      <HeaderComponent />
      <OrderManagementScreen/>
    </ContainerComponent>
  )
}

export default OrderScreen
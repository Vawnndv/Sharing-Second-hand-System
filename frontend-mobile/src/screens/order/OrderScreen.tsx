import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import OrderManagementScreen from './OrderManagementScreen'

const OrderScreen = () => {
  return (
    <ContainerComponent back>
      <HeaderComponent />
      <OrderManagementScreen/>
    </ContainerComponent>
  )
}

export default OrderScreen
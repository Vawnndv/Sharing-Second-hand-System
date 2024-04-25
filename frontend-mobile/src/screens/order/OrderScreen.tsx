import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import OrderManagementScreen from './OrderManagementScreen'

const OrderScreen = () => {
  return (
    <ContainerComponent back title='Đơn Hàng Của Bạn'>
      <OrderManagementScreen/>
    </ContainerComponent>
  )
}

export default OrderScreen
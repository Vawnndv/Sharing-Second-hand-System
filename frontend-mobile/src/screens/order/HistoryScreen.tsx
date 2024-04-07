import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import HistoryManagementScreen from './HistoryManagementScreen'

const HistoryScreen = () => {
  return (
    <ContainerComponent back right title='Lịch sử giao dịch'>
      <HistoryManagementScreen/>
    </ContainerComponent>
  )
}

export default HistoryScreen
import Axios from '../APIs/Axios';

// getOrdersCollaborator API call
const getOrdersCollaborator = async (userID: string, tab: string, filterValue: any, categoryQuery: string): Promise<any>  => {
  console.log('TAB', tab)
  const { orders }: any = await Axios.get(`/ordersCollab?userID=${userID}&type=${tab}&distance=${filterValue.distance}&time=${filterValue.time}&category=${categoryQuery}&sort=${filterValue.sort}`)
  return {
    orders
  };
}

// getOrdersCollaborator API call
const getOrderDetailsCollaborator = async (orderID: any): Promise<any>  => {
  const { orders }: any = await Axios.get(`/orderDetailsCollab?orderID=${orderID}`)
  return {
    orders
  };
}

export {
  getOrdersCollaborator,
  getOrderDetailsCollaborator
}
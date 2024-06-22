import Axios from '../APIs/Axios';

// getOrdersCollaborator API call
const getOrdersCollaborator = async (userID: string, tab: string, filterValue: any, categoryQuery: string, searchQuery: string, typeCard: string): Promise<any>  => {
  const { orders }: any = await Axios.get(`/ordersCollab?userID=${userID}&type=${tab}&distance=${filterValue.distance}&time=${filterValue.time}&category=${categoryQuery}&sort=${filterValue.sort}&search=${searchQuery}&typeCard=${typeCard}`)
  return {
    orders
  };
}

// getOrdersCollaborator API call
const getOrderDetailsCollaborator = async (orderID: any, typeCard: any): Promise<any>  => {
  const { orders }: any = await Axios.get(`/orderDetailsCollab?orderID=${orderID}&typeCard=${typeCard}`)
  return {
    orders
  };
}

export {
  getOrdersCollaborator,
  getOrderDetailsCollaborator
}
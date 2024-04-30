import Axios from '../APIs/Axios';

// Get Order API call
const getOrderListByStatus = async (userid: string, status: string[], method: string[], limit: number, page: number, isOverdue: boolean): Promise<any>  => {
  const { data } = await Axios.post(`/order/listOrders`, {
    userid,
    status,
    method,
    limit,
    page,
    isOverdue
  })

  return {
    orders: data.orders,
    totalItems: data.totalItems
  };
}

// Get Detail Order API call
const getOrderDetail = async (orderid: number): Promise<any>  => {
  const { data } = await Axios.get(`/order/${orderid}`)
  return {
    data
  };
}

// Get Detail Order API call
const getImagesItem = async (itemIDs: string): Promise<any>  => {
  const { itemImages }: any = await Axios.get(`/items/images/${itemIDs}`)
  return {
    itemImages
  };
}

// Get Tracking Order API call
const getTrackingOrder = async (orderID: string): Promise<any>  => {
  const { data }: any = await Axios.get(`/order/tracking?orderID=${orderID}`)
  return {
    data
  };
}

export {
  getOrderListByStatus,
  getOrderDetail,
  getImagesItem,
  getTrackingOrder
}
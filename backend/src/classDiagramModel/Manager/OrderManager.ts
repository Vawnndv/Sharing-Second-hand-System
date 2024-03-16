import { Order } from "../Order";

export class OrderManager{
    public constructor(){

    }

    public createOrder(orderID: string): boolean{
        // code here
        return true;
    }

    public showOrders(userID: string): Order[]{
        // code here
        return []
    }

    public getOrderDetails(orderID: string): Order{
        // code here
        return new Order('');
    }
}
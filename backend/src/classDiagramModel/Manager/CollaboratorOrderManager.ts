import { OrderManager } from "./OrderManager";
import { Order } from "../Order";

export class CollaboratorOrderManager extends OrderManager{
    public constructor(){
        super();
    }

    public showOrdersByWarehouse(warehouseID: string): Order[]{
        // code here
        return []
    }

    public deleteOrder(orderID: string): boolean{
        // code here
        return true;
    }

    public editOrder(orderID: string): boolean{
        // code here
        return true;
    }
}
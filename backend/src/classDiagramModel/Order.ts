import { Item } from "./Item";
import { Status } from "./Status";
import { Trace } from "./Trace";

export class Order{
    private orderID: string | undefined;
    private title: string | undefined;
    private receiverId: string | undefined;
    private giverId: string | undefined;
    private orderCode: string | undefined;
    private qrCode: string | undefined;
    private status: string | undefined;
    private location: string | undefined;
    private description: string | undefined;
    private time: string | undefined;
    private itemID: string | undefined;
    private departure: string | undefined;
    private item: Item | undefined;
    private trace: Trace | undefined;
    private currentStatus: Status | undefined;

    public constructor(orderID: string){
        this.orderID = orderID;
    }

    public updateStatus(status: string, time: string){
        this.trace?.updateStatus(status, time);
    }

    public deleteOrder(): void{
        // code here
    }
}
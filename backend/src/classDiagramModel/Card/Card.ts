import { Status } from "../Status";


export class Card{
    private cardID: string | undefined;
    private time: string | undefined;
    private itemID: string | undefined;
    private orderID: string | undefined;
    private giverID: string | undefined;
    private receiverID: string | undefined;
    private warehouseID: string | undefined;
    private qrCode: string | undefined;
    private status: Status | undefined;

    public constructor(cardID: string){
        this.cardID = cardID;
    }

    protected updateStatus(): void{
        // code here
    }
}
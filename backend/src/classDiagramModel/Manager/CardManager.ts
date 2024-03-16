import { Card } from "../Card/Card";

export class CardManager{

    public constructor(){

    }

    public viewListCard(warehouseID: string): Card[]{
        // code here
        return [];
    }

    public viewCardDetails(cardID: string): Card{
        // code here
        return new Card('');
    }

    public editCard(cardID: string): boolean{
        // code here
        return true;
    }
}
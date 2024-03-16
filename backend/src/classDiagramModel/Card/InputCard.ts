import { Card } from "./Card";

export class InputCard extends Card{
    public constructor(orderID: string){
        super(orderID);
    }

    public updateStatus(): void{
        // code here
    }

    public generateQR(): string{
        // code here
        return '';
    }
}
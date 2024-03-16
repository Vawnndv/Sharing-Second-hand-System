
export class Item{
    private itemID: string | undefined;
    private name: string | undefined;
    private quantity: number | undefined;
    
    public constructor(itemID: string){
        this.itemID = itemID;
    }

    public updateItem(itemID: string, name: string, quantity: number): void{
        // code here
    }

    public deleteItem(): void{
        // code here
    }
}
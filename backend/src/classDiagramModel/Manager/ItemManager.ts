import { Item } from "../Item";

export class ItemManager{
    public constructor(){

    }

    public giveItem(postID: string, userID: string): void{
        // code here
    }

    public receiveItem(postID: string, userID: string): void{
        // code here
    }

    public filterItem(itemName: string): Item[]{
        // code here
        return [];
    }

    public searchItem(stringSearch: string): Item[]{
        // code here
        return [];
    }

    public viewItemDetails(itemID: string): Item{
        // code here
        return new Item('');
    }
}
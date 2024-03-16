import { Collaborator } from "./Collaborator";
import { CardManager } from "./Manager/CardManager";
import { ItemManager } from "./Manager/ItemManager";


export class Warehouse{

    private warehouseID: string | undefined;
    private name: string | undefined;
    private address: string | undefined;
    private phone: string | undefined;
    private createAt: string | undefined;
    private collaboratorQuantity: number | undefined;
    private listItem: ItemManager[] | undefined;
    private listCard: CardManager[] | undefined;
    private listCollaborator: Collaborator[] | undefined;
    
    public constructor(warehouseID: string){
        this.warehouseID = warehouseID;
    }
}
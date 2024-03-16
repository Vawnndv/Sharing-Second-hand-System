import { Collaborator } from "../Collaborator";
import { UserManager } from "./UserManager";


export class CollaboratorManager extends UserManager{

    public constructor(){
        super();
    }

    public viewByWarehouse(warehouseID: string): Collaborator[] {
        // code here
        return []
    }
}
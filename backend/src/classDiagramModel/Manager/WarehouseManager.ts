import { Collaborator } from "../Collaborator";
import { Warehouse } from "../Warehouse";


export class WarehouseManager {
    public constructor(){

    }

    public viewCollaborators(warehouseID: string): Collaborator[]{
        // code here
        return []
    }

    public getWarehouseInfomation(warehouseID: string): Warehouse{
        // code here
        return new Warehouse('');
    }

    public editWarehouse(warehouseID: string): boolean{
        // code here
        return true;
    }
}
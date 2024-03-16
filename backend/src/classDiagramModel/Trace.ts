import { Status } from "./Status";

export class Trace{
    private traceID: string | undefined;
    private itemID: string | undefined;

    public constructor(traceID: string, itemID: string){
        this.traceID = traceID;
        this.itemID = itemID;
    }

    public getListStatus(): Status[]{
        // code here
        return[];
    }

    public updateStatus(status: string, time: string): void{
        // code here
    }

    public getCurrentStatus(): Status{
        // code here
        return new Status('', '', '');
    }

}
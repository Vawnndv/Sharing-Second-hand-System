
export class Status{
    private statusID: string | undefined;
    private status: string | undefined;
    private time: string | undefined;

    public constructor(statusID: string, status: string, time: string){
        this.statusID = statusID;
        this.status = status;
        this.time = time;
    }

    public viewStatus(): string{
        // code here
        return ''
    }
}
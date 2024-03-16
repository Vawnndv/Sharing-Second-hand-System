
export class Report{
    private senderID: string | undefined;
    private receiverId: string | undefined;
    private description: string | undefined;
    private createAt: string | undefined;
    public constructor(senderID: string, receiverId: string, description: string, createAt: string){
        this.senderID = senderID;
        this.receiverId = receiverId;
        this.description = description;
        this.createAt = createAt;
    }

    public delete(): void{
        // code here
    }
}
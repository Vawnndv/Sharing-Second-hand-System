

export class Post{
    private postID: string | undefined;
    private title: string | undefined;
    private productID: string | undefined;
    private time: string | undefined;
    private ownerID: string | undefined;
    private description: string | undefined;
    private location: string | undefined;
    public constructor(postID: string){
        this.postID = postID;
    }

    public update(): boolean{
        // code here
        return true;
    }

    public delete(): boolean{
        // code here
        return true;
    }
}
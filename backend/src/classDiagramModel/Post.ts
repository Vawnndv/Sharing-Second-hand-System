

export class Post {
  private postID: number | undefined;

  private title: string | undefined;

  private productID: string | undefined;

  private time: string | undefined;

  private owner: string | undefined;

  private description: string | undefined;

  private location: string | undefined;

  private timestart: Date | undefined;

  private timeend: Date | undefined;

  private phonenumber: string | undefined;




  constructor(
    postID?: number,
    title?: string,
    productID?: string,
    time?: string,
    owner?: string,
    description?: string,
    location?: string,
    timestart?: Date,
    timeend?: Date,
    phonenumber?: string,

  ) {
    this.postID = postID;
    this.title = title;
    this.productID = productID;
    this.time = time;
    this.owner = owner;
    this.description = description;
    this.location = location;
    this.timestart = timestart;
    this.timeend = timeend;
    this.phonenumber = phonenumber;
  }

  public update(): boolean {
    // code here
    return true;
  }

  public delete(): boolean {
    // code here
    return true;
  }

}
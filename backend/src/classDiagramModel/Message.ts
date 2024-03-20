
export class Message {
  private receiverID: string | undefined;

  private senderID: string | undefined;

  private content: string | undefined;

  private createAt: string | undefined;

  private file: string | undefined;

  public constructor(receiverID: string, senderID: string, content: string, createAt: string, file: string | undefined) {
    this.receiverID = receiverID;
    this.senderID = senderID;
    this.content = content;
    this.createAt = createAt;
    this.file = file;
  }
}
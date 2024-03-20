
export class Notification {
  private notiID: string | undefined;

  private name: string | undefined;

  private description: string | undefined;

  private createAt: string | undefined;

  private senderId: string | undefined;

  private listReceiver: string[] | undefined;

  private link: string | undefined;

  public Notification() {

  }

  public constructor(notiID: string, name: string, description: string, createAt: string, senderId: string, listReceiver: string[], link: string) {
    this.notiID = notiID;
    this.name = name;
    this.description = description;
    this.createAt = createAt;
    this.senderId = senderId;
    this.listReceiver = listReceiver;
    this.link = link;
  }

}
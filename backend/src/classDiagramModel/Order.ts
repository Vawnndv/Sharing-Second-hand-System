import { Item } from './Item';
import { Status } from './Status';
import { Trace } from './Trace';
import pool from '../config/DatabaseConfig';
import { User } from './User';
import { Post } from './Post';

export class Order {
  private orderID: number | undefined;

  private title: string | undefined;

  private receiver: User | undefined;

  private giver: User | undefined;

  private orderCode: string | undefined;

  private qrCode: string | undefined;

  private status: string | undefined;

  private location: string | undefined;

  private description: string | undefined;

  private time: string | undefined;

  private itemID: number | undefined;

  private departure: string | undefined;

  private item: Item | null;

  private trace: Trace | undefined;

  private currentStatus: Status | undefined;

  private post: Post | null;

  public constructor(orderID: number, title: string, receiver: User | undefined, giver: User | undefined,
    orderCode: string, qrCode: string, status: string, location: string, description: string,
    time: string, item: Item | null, departure: string, post: Post | null) {
    this.orderID = orderID;
    this.title = title;
    this.receiver = receiver;
    this.giver = giver;
    this.orderCode = orderCode;
    this.qrCode = qrCode;
    this.status = status;
    this.location = location;
    this.description = description;
    this.time = time;
    this.item = item;
    this.departure = departure;
    this.post = post
    // this.item = item;
    // this.trace = trace;
    // this.currentStatus = currentStatus;
  }

  public updateStatus(status: string, time: string) {
    this.trace?.updateStatus(status, time);
  }

  public deleteOrder(): void {
    // code here
  }

  public setGiver(giver: User): void{
    this.giver = giver
  }

  public setReceiver(receiver: User): void{
    this.receiver = receiver
  }
}
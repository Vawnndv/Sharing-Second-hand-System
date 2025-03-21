import { Item } from './Item';
import { Status } from './Status';
import { Trace } from './Trace';
import pool from '../config/DatabaseConfig';
import { User } from './User';
import { Post } from './Post';
import { Address } from './Address';

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

  private addressGive: Address | null;

  private addressReceive: Address | null;

  private timeStart: string | undefined;

  private timeEnd: string | undefined;

  private giveTypeID: number | undefined

  private imagePath: string | undefined

  public constructor(orderID: number, title: string, receiver: User | undefined, giver: User | undefined,
    orderCode: string, qrCode: string, status: string, location: string, description: string,
    time: string, item: Item | null, departure: string, post: Post | null, addressGive: Address | null, addressReceive: Address | null) {
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
    this.addressGive = addressGive;
    this.addressReceive = addressReceive;
  }

  public updateStatus(status: string, time: string) {
    this.trace?.updateStatus(status, time);
  }

  public deleteOrder(): void {
    
  }

  public setGiver(giver: User): void{
    this.giver = giver
  }

  public setReceiver(receiver: User): void{
    this.receiver = receiver
  }

  public setTime(timeStart: string, timeEnd: string){
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
  }

  public setGiveTypeID (giveTypeID: number){
    this.giveTypeID = giveTypeID;
  }

  public setImagePath (imagePath: string){
    this.imagePath = imagePath;
  }
}
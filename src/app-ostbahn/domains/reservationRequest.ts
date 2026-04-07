import {Child} from './child';

export class ReservationRequest{
  connectionId:number;
  firstClass:boolean;
  children:Child[]


  constructor(connectionId: number, firstClass: boolean, children: Child[]) {
    this.connectionId = connectionId;
    this.firstClass = firstClass;
    this.children = children;
  }
}

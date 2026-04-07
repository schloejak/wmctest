import {Child} from './child';

export class ReservationResponse{
  id:number;
  connectionId:number;
  firstClass:boolean;
  children:Child[];


  constructor(id: number, connectionId: number, firstClass: boolean, children: Child[]) {
    this.id = id;
    this.connectionId = connectionId;
    this.firstClass = firstClass;
    this.children = children;
  }
}

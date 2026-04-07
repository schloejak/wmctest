export class Connection{
  id: number;
  fromStationId: number;
  toStationId: number;
  fromStationName: string;
  toStationName:string;
  date: string;
  departureTime:string;
  arrivalTime:string;


  constructor(id: number, fromStationId: number, toStationId: number, fromStationName: string, toStationName: string, date: string, departureTime: string, arrivalTime: string) {
    this.id = id;
    this.fromStationId = fromStationId;
    this.toStationId = toStationId;
    this.fromStationName = fromStationName;
    this.toStationName = toStationName;
    this.date = date;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
  }
}

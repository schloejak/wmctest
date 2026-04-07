import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Connection} from './domains/connection';
import {ReservationRequest} from './domains/reservationRequest';
import {ReservationResponse} from './domains/reservationResponse';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseurl = 'http://localhost:3000/'
  constructor(private http:HttpClient) {
  }

  getAllConnections(){
    return this.http.get<Connection[]>(this.baseurl + "connections")
  }

  getConnection(connectionId: number) {
    return this.http.get<Connection>(this.baseurl + "connections/" + connectionId)
  }

  postReservation(reservation:ReservationRequest){
    return this.http.post(this.baseurl + "reservations", reservation)
  }

  getAllReservations(){
    return this.http.get<ReservationResponse[]>(this.baseurl+"reservations")
  }

  getReservationById(id:number){
    return this.http.get<ReservationResponse>(this.baseurl+ "reservations/"+id)
  }
}

import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '../http.service';
import {Connection} from '../domains/connection';
import {AuthService} from '../auth.service';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ReservationRequest} from '../domains/reservationRequest';
import {ReservationResponse} from '../domains/reservationResponse';

@Component({
  selector: 'app-reservation',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent implements OnInit {
  detailTab = signal(false)
  connectionId = -1;
  connection = signal<Connection>({} as Connection)
  user = signal('')
  reservationGroup: FormGroup;
  neuReservation = signal<ReservationResponse>({} as ReservationResponse)

  constructor(private route: ActivatedRoute, private api: HttpService, private auth: AuthService) {
    this.user.set(this.auth._user())
    this.reservationGroup = new FormGroup({
      firstClassBox: new FormControl(false) ?? false,
      childrenArray: new FormArray([]) ?? []
    })
  }

  get childrenArray() {
    return this.reservationGroup.get('childrenArray') as FormArray
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.connectionId = Number(params.get('id'));

      if (this.connectionId) {
        this.api.getConnection(this.connectionId).subscribe(
          conn => this.connection.set(conn)
        );
      }
    })
  }

  addChild() {
    this.childrenArray.push(new FormGroup({
      name: new FormControl(''),
      age: new FormControl(0)
    }))
  }

  protected removeChild($index: number) {
    this.childrenArray.removeAt($index)
  }

  reserve() {
    let reservation: ReservationRequest = {
      connectionId: this.connectionId,
      firstClass: this.reservationGroup.get('firstClassBox')?.value ?? false,
      children: this.childrenArray.value ?? []
    }
    console.log(reservation)
    this.api.postReservation(reservation).subscribe(
      {
        next: () => {
          let reservations: ReservationResponse[] = []
          this.detailTab.set(true)
          this.api.getAllReservations().subscribe(res => {
            reservations = res;
            if (reservations[reservations.length - 1]) {
              this.api.getReservationById(reservations[reservations.length - 1].id).subscribe(reser => {
                this.neuReservation.set(reser)
              })
            }
          })
        }
      }
    )


  }

  renew() {
    this.reservationGroup.reset()
    this.childrenArray.clear()
    this.detailTab.set(false)

  }
}

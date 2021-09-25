import {
  Component, OnInit, ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { PagesService } from 'src/app/core/service/pages.service';
import { pages } from 'src/app/core/utiles/pages.utils';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  isDate,
} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { ToastrService } from 'ngx-toastr';
import { ReservationService } from 'src/app/core/service/reservation.service';
import { UserService } from 'src/app/core/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TerrainService } from 'src/app/core/service/terrain.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

interface IdetailedReservations {
  id: string;
  client: any;
}

@Component({
  selector: 'app-owner-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './owner-calendar.component.html',
  styleUrls: ['./owner-calendar.component.scss']
})

export class OwnerCalendarComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  pagesRoute = pages.pagesRoute;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];


  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  enAttente: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = true;
  note = 0;

  reservations = [];
  detailedReservations = [];

  subCurrentUser: Subscription | null = null;
  currentUser: any = null;
  terrainId: any;
  constructor(
    private modal: NgbModal,
    private pagesService: PagesService,
    private toastr: ToastrService,
    private reservationService: ReservationService,
    private userService: UserService,
    private router: Router,
    private terrainService: TerrainService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.subCurrentUser = this.userService.subCurrentUser()
    //   .subscribe((user) => {
    //     this.currentUser = user;
    //     console.log(this.currentUser);
    //   });
    this.terrainId = this.activatedRoute.snapshot.paramMap.get('id');
    this.reservationService.getReservationOwner(this.terrainId)
      .then((res) => {
        console.log(res)
        this.detailedReservations = res.reservation[0].map((el) => {
          return {
            id: el._id,
            client: el.client
          }
        });
        console.log(this.detailedReservations);
        res.reservation[0]?.forEach(element => {
          const reservation = {
            title: element.confirmed ? 'Reservation' : 'En attente',
            // this is where I add the id of the reservation to delete or to confirm
            start: new Date(element.startAt),
            end: new Date(element.endAt),
            id: element._id,
            color: element.confirmed ? colors.blue : colors.red,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
          }
          this.events.push(reservation);

          if (!element.confirmed) {
            this.enAttente.push(reservation);
          }
        });
        this.refresh.next();
      });

    this.pagesService.setCurrentIndex(pages.pagesRef.addEvent);

  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = true;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.enAttente = this.enAttente.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      console.log(this.enAttente)
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    if (this.note === 0) {
      this.toastr.info("Note that reservation time must be more than one hour. choose carefully the reservation's time")
      this.note = 1;
    }
    console.log(this.enAttente)
    console.log(this.events)
    this.enAttente = [
      ...this.enAttente,
      {
        title: 'new reservation',
        // this is where I add the id of the reservation to delete or to confirm
        id: 'new',
        start: new Date(),
        end: new Date(),
        color: colors.blue,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }
  event(): any {
    if (this.events.length === 0) {
      this.toastr.warning('no event added');
      return;
    }

    const wrongReservation = this.events.filter(event => {
      if (!(event.end.getDate() > event.start.getDate())) {
        if (((event.end.getHours() - event.start.getHours()) <= 0)) {
          return true;
        }
      }
    })
    if (wrongReservation.length > 0) {
      this.toastr.warning('there is an invalid reservation.')
      return;
    }
  }

  goTo(path, data = ''): void {
    path === this.pagesRoute.terrainDetail ? this.router.navigate([path, data]) : this.router.navigate([path]);
  }

  reservationDetail(id: string): IdetailedReservations {
    const reservation = this.detailedReservations.find((el: IdetailedReservations) => el.id === id);
    return reservation.client ? reservation.client : false;
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    // console.log(eventToDelete);
    // console.log()
    this.enAttente = this.enAttente.filter((event) => event !== eventToDelete);
    if (eventToDelete.id === 'new') {
      return;
    }
    this.events = this.events.filter((event) => event !== eventToDelete);

    this.reservationService.deleteReservation(eventToDelete.id)
      .then((res) => {
        this.toastr.success('reservation deleted')
      })

  }
  confirmEvent(eventToConfirm: CalendarEvent): void {
    this.enAttente = this.enAttente.filter((event) => event !== eventToConfirm);


    if (eventToConfirm.id === 'new') {
      this.events.push(eventToConfirm);
      this.reservationService.reserve({
        terrain: this.terrainId,
        startAt: eventToConfirm.start,
        endAt: eventToConfirm.end,
      }).then((res) => {
        console.log(res)
        if (res.code === 1) {
          this.detailedReservations.push({
            id: res.reservation.id,
            client: null
          })
          this.toastr.success('reservation successfully created')
        }
      })
    } else {
      this.events.forEach((el) => {
        if (el.id === eventToConfirm.id) {
          el.color = colors.blue;
          el.title = 'Reservation';
        }
      });
      this.reservationService.acceptReservation({ reservation_id: eventToConfirm.id })
        .then((res) => {
          this.toastr.success('reservation successfully confirmed')
        })
    }
    this.refresh.next();
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = true;
  }
}

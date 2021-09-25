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

@Component({
  selector: 'app-add-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {



  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();



  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = true;
  note = 0;
  subCurrentUser: Subscription | null = null;
  currentUser: any = null;

  constructor(
    private modal: NgbModal,
    private pagesService: PagesService,
    private toastr: ToastrService,
    private reservationService: ReservationService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.subCurrentUser = this.userService.subCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
        console.log(this.currentUser);
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
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    if (this.note === 0) {
      this.toastr.info("Note that reservation time must be more than one hour. choose carefully the reservation's time")
      this.note = 1;
    }
    this.events = [
      ...this.events,
      {
        title: 'A football match',
        // this is where I add the id of the reservation to delete or to confirm
        // id: 1,
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
  evnts(): any {
    if (this.events.length === 0) {
      this.toastr.warning('no event added');
      return;
    }

    const wrongReservation = this.events.filter(event => {
      if (!(event.end.getDate() > event.start.getDate())) {
        if (((event.end.getHours() - event.start.getHours()) <= 0)) {
          return true
        }
        // Do whatever you want
      }
    })
    if (wrongReservation.length > 0) {
      console.log(this.events[0]);
      this.toastr.warning('there is an invalid reservation.')
      return;
    }

    this.reservationService.reserve({
      startAt: this.events[0].start,
      endAt: this.events[0].end,
      terrain: "60ab8436c07953378c1750b1",
    }).then((res) => {
      console.log(res)
      this.toastr.success('Reservations successfully confirmed');
      this.events = []
      this.refresh.next()
    })
      .catch((err) => console.log(err))

    // if(x===1)
    // return false;
    // let x = new Date();
    // let y = x.getMonth()
    // let startDate = Date.parse('Sun May 23 2021 01:00:00 GMT+0200 (Central European Summer Time)');
    // let endDate = Date.parse('Sun May 23 2021 18:30:00 GMT+0200 (Central European Summer Time)');
    // const s = new Date(startDate)
    // const e = new Date(endDate)
    // console.log(s.getHours() - e.getHours())
    // console.log(e)
    // console.log(s.getDate())
    // console.log(x.getUTCHours())
    // console.log(x.getMonth())
    // console.log(x.getFullYear())
    // let z = new Date(Number(x) - Number(y))
    // console.log(z)

  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
    console.log(eventToDelete);
    // console.log()
    let start = Date.parse('May 17, 2021 13:30');
    let startNumber: Date = new Date(start);
    // console.log(isDate(startNumber))
    console.log(startNumber.getHours())
    console.log(startNumber.getMinutes());
    console.log(startNumber.toDateString());
    console.log(start);

  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = true;
  }
}

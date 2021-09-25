import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TerrainService } from 'src/app/core/service/terrain.service';

import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { ActivatedRoute, Params } from '@angular/router';

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
  selector: 'app-terrain-detail',
  templateUrl: './terrain-detail.component.html',
  styleUrls: ['./terrain-detail.component.scss']
})
export class TerrainDetailComponent implements OnInit, OnDestroy {
  // calendar

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;
  note = 0;
  reservations = [];
  // calendar end

  // google variables
  center: google.maps.LatLngLiteral = { lat: 36.8, lng: 10.1 };
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,

  };
  markerPositions: google.maps.LatLngLiteral;
  gg: google.maps.Marker[] = [];


  subCurrentPublication: Subscription | null = null;

  images = ['../../../assets/terrain5.jpg', '../../../assets/terrain1.jpg', '../../../assets/terrain6.jpg'];
  currentPublication: any;
  value = 4;
  constructor(
    private terrainService: TerrainService,
    private activatedRoute: ActivatedRoute,
    private modal: NgbModal

  ) { }

  ngOnInit(): void {
    this.terrainService.getDetailTerrain(this.activatedRoute.snapshot.paramMap.get('id')).then((res) => {
      this.currentPublication = res.terrain;
      this.markerPositions = res.terrain.position;
      this.center = res.terrain.position
      this.reservations = this.currentPublication.reservation.filter((reservation) => reservation.confirmed === true);
      this.reservations.forEach((reservation) => {
        this.events.push({
          title: 'Reservation',
          start: new Date(reservation.startAt),
          end: new Date(reservation.endAt),
          color: colors.blue,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        })
      });
      this.refresh.next()
    });

  }

  // calendar funct start
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
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }


  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = true;
  }
  // calendar funct end


  ngOnDestroy(): void {
    // if (this.subCurrentPublication) {
    //   this.subCurrentPublication.unsubscribe();
    // }
  }
}

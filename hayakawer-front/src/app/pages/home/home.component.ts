import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PagesService } from 'src/app/core/service/pages.service';
import { pages } from 'src/app/core/utiles/pages.utils';
// import { EChartsOption, echarts } from 'echarts';
import { Subject, Subscription } from 'rxjs';

import * as echarts from 'echarts';
import { UsersService } from 'src/app/core/service/users.service';
import { UserService } from 'src/app/core/service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TerrainService } from 'src/app/core/service/terrain.service';
import { InputService } from 'src/app/core/utiles/input.service';
import { places } from 'src/app/core/utiles/places';
import { CalendarView, CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns';
import { ReservationService } from 'src/app/core/service/reservation.service';

let map: google.maps.Map;



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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
  /////////////////////////////////////////// For terrain details

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

  images = ['../../../assets/terrain5.jpg', '../../../assets/terrain1.jpg', '../../../assets/terrain6.jpg'];
  currentPublication: any;


  requestReservation = [];


  ///////////////////////////////////////////////

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalFilter') modalFilter: TemplateRef<any>;

  center: google.maps.LatLngLiteral = { lat: 36.8, lng: 10.1 };
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  gg: google.maps.Marker[] = [];

  public filterForm!: FormGroup;
  public controlForm: any = null;
  pageSize = 7;
  loader = false;
  subCurrentUser: Subscription | null = null;
  currentUser: any = null;
  value = 1.5;
  pagesRoute = pages.pagesRoute;
  terrains = [];
  publicationDisplayList = [];
  filterText = '';
  pageContent = 'stats';
  page = 1;
  total = 0;
  limit = 8;
  terrainToUpdate = null;
  states = []

  cities = []







  /////////////////////////////////////////

  deletedAccounts = 0;
  totalReservation = 0;

  govDetails = {
    widths: {
      terrain: '0%',
      client: '0%',
      proprietaire: '0%',
      reservation: '0%',
      users: '0%',
    },
    numbers: {
      terrain: 0,
      client: 0,
      proprietaire: 0,
      reservation: 0,
      users: 0,
    }

  };
  pieOptions =
    {
      title: {
        text: 'Users',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      grid: {
        show: false,
        width: '100%',
      },
      series: [
        {
          name: 'user type:',
          type: 'pie',
          radius: ['60%', '37%'],
          width: '100%',
          label: {
            show: false,
            position: 'center'
          },
          data: [
            { value: 1048, name: 'clients' },
            { value: 735, name: 'Proprietaire' },
            { value: 0, name: 'admin' },
          ],
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
        }
      ]
    };
  proprietairePieOptions =
    {
      title: {
        text: 'Reservations',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      grid: {
        show: false,
        width: '100%',
      },
      series: [
        {
          name: 'Reservation :',
          type: 'pie',
          radius: ['60%', '37%'],
          width: '100%',
          label: {
            show: false,
            position: 'center'
          },
          data: [
            { value: 1048, name: 'Accepted' },
            { value: 735, name: 'Refused' },
          ],
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
        }
      ]
    };

  govOptions: echarts.EChartsCoreOption = {
    color: [
      '#5fa641'
    ],
    dataset: {
      source: [
        ['score', 'Nbre', 'users'],
        [100, 800, 'users'],
        [25, 250, 'clients'],
        [75, 750, 'Proprietaires'],
      ]
    },
    grid: { containLabel: true },
    xAxis: { name: 'Nbre' },
    yAxis: { type: 'category' },
    visualMap: {
      orient: 'horizontal',
      left: 'center',
      min: 10,
      max: 100,
      text: ['High Score', 'Low Score'],
      // Map the score column to color
      dimension: 0,
      inRange: {
        color: ['blue', 'red', 'tomato']
      }
    },
    series: [
      {
        type: 'bar',
        encode: {
          // Map the "Nbre" column to X axis.
          x: 'Nbre',
          // Map the "users" column to Y axis
          y: 'users'
        }
      }
    ]
  };

  currentGov = "Tunis";

  constructor(
    private pagesService: PagesService,
    private usersService: UsersService,
    private userService: UserService,
    private toastr: ToastrService,
    private terrainService: TerrainService,
    private modal: NgbModal,
    private fb: FormBuilder,
    private reservationService: ReservationService
  ) {
  }

  totalClients = 0;
  totalProprietaires = 0;
  totalUsers = 0;
  totalTerrains = 0;

  userType = 'admin';
  proprietaireStats = {
    total_accepted_reservation: 0,
    total_refused_reservation: 0,
    income: 0,
  };


  currentFilter = {}

  ngOnInit(): void {

    this.getTerrains();
    this.userService.getCurrentUser()
      .then((res) => {
        this.userType = res.user.userType;
        if (this.userType === 'admin') {
          this.initMap();
          this.initData();
          this.getGovDetails(this.currentGov);
        } else {
          res.user.terrain.forEach(element => {
            this.proprietaireStats.total_accepted_reservation = this.proprietaireStats.total_accepted_reservation + element.acceptedReservation;
            this.proprietaireStats.total_refused_reservation = this.proprietaireStats.total_refused_reservation + element.refusedReservation;
            this.proprietaireStats.income = this.proprietaireStats.income + (element.acceptedReservation * element.price)
          });
        }
      });
    this.pagesService.setCurrentIndex(pages.pagesRef.home);
  }

  getTerrains() {
    this.terrainService.getTerrains({
      filter: {},
      limit: this.limit,
      page: this.page
    })
      .then((res) => {
        this.terrains = res.terrains;
        this.publicationDisplayList = res.terrains;
        this.total = res.total;

      })
      .catch((err) => console.log(err));
  }



  initMap(): void {
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 6.3,
      center: { lat: 33.8869, lng: 9.5375 },
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      gestureHandling: 'none'
      // panControlOptions: false,



    });

    // Load GeoJSON.
    map.data.loadGeoJson(
      './../../../assets/test.geojson'
    );

    // Add some style.
    map.data.setStyle((feature) => {
      return /** @type {google.maps.Data.StyleOptions} */ {
        fillColor: 'gray',
        strokeWeight: 1,
      };
    });

    map.data.addListener("mouseover", (event) => {
      map.data.revertStyle();
      map.data.overrideStyle(event.feature, { fillColor: 'green' });

    });
    map.data.addListener("click", (event) => {
      this.currentGov = event.feature.getProperty("gov_name_f");
      this.getGovDetails(this.currentGov);
    });

    // Set mouseover event for each feature.
    // map.data.addListener("mouseover", (event) => {
    //   (document.getElementById("info-box") as HTMLElement).textContent =
    //     event.feature.getProperty("gov_name_f");
    //   map.data.setStyle((feature) => {
    //     let color = "gray";

    //     if (feature.getProperty("gov_name_f")) {
    //       color = feature.getProperty("color");
    //     }
    //     return /** @type {!google.maps.Data.StyleOptions} */ {
    //       // fillColor: color,
    //       strokeColor: color,
    //       strokeWeight: 2,
    //     };

    //   });
    // });
  }

  getGovDetails(gov) {
    this.usersService.getUserStats({ filter: { region: gov } }).then((res) => {
      this.govDetails.widths.users = res.region_total_users_stat;
      this.govDetails.numbers.users = res.region_total_users;

    })
      .catch(err => console.log(err));
    this.usersService.getUserStats({ filter: { region: gov, userType: 'client' } }).then((res) => {
      this.govDetails.widths.client = res.region_total_users_stat;
      this.govDetails.numbers.client = res.region_total_users;

    })
      .catch(err => console.log(err));
    this.usersService.getUserStats({ filter: { region: gov, userType: 'proprietaire' } }).then((res) => {
      this.govDetails.widths.proprietaire = res.region_total_users_stat;
      this.govDetails.numbers.proprietaire = res.region_total_users;

    })
      .catch(err => console.log(err));
    this.usersService.getTerrainStats({ filter: { region: gov } })
      .then((res) => {
        this.govDetails.widths.terrain = res.region_total_terrains_stat;
        this.govDetails.numbers.terrain = res.region_total_terrains;
      })
      .catch(err => console.log(err))
  }

  initData() {
    this.usersService.getTotalStats()
      .then(res => {
        this.totalReservation = res.reservation;
        this.deletedAccounts = res.deletedAccount;
        // this.deletedAccountsOptions.title.subtext = res.deletedAccount;
      })

    this.usersService.getUserStats({ filter: {} }).then((res) => {
      this.totalUsers = res.region_total_users
    })
      .catch(err => console.log(err));

    this.usersService.getUserStats({ filter: { userType: 'client' } }).then((res) => {
      this.totalClients = res.region_total_users
      this.pieOptions.series[0].data[0].value = res.region_total_users;
    })
      .catch(err => console.log(err));

    this.usersService.getUserStats({ filter: {} }).then((res) => {
      // this.newAccountsOptions.title.subtext = res.region_total_users;
    })
      .catch(err => console.log(err));
    this.usersService.getUserStats({ filter: { userType: 'proprietaire' } }).then((res) => {
      this.totalProprietaires = res.region_total_users
      this.pieOptions.series[0].data[1].value = res.region_total_users;
      this.pieOptions.title.subtext = `${this.totalClients + this.totalProprietaires} Total`
    })
      .catch(err => console.log(err));
    this.usersService.getUserStats({ filter: { userType: 'admin' } }).then((res) => {
      this.totalProprietaires = res.region_total_users
      this.pieOptions.series[0].data[2].value = res.region_total_users;
      // this.pieOptions.title.subtext = `${this.totalClients + this.totalProprietaires} Total`
    })
      .catch(err => console.log(err));

    this.usersService.getTerrainStats({ filter: {} })
      .then((res) => {
        this.totalTerrains = res.region_total_terrains;
      })
      .catch(err => console.log(err))
  }

  createForm(): void {
    this.filterForm = this.fb.group({
      minPrice: [],
      maxPrice: [],
      minCapacity: [],
      maxCapacity: [],
      region: [],
      city: [],
    });
  }

  pageChanged(e) {
    this.page = e;
    this.terrainService.getTerrains({
      filter: this.currentFilter,
      limit: this.limit,
      page: this.page
    })
      .then((res) => {
        this.terrains = res.terrains;
        this.publicationDisplayList = res.terrains;
        this.total = res.total;
      })
  }
  filterWithText(filterValue) {
    this.currentFilter = {
      $or: [
        { title: { "$regex": filterValue.trim(), "$options": "i" } },
        { description: { "$regex": filterValue.trim(), "$options": "i" } },
      ]
    }
    this.terrainService.getTerrains({
      filter: this.currentFilter,
      limit: this.limit
    })
      .then((res) => {
        this.terrains = res.terrains;
        this.publicationDisplayList = res.terrains;
        this.total = res.total;
      });
  }

  detect() {
    const state = this.filterForm.get('region').value;
    this.cities = [];
    this.cities = places.find((el) => el.gov === state).city;
  }

  openFilterModal(): void {
    this.createForm();
    this.modal.open(this.modalFilter, { size: 'lg' });
    this.states = places.map(el => el.gov);
    // console.log()
  }

  submitForm() {
    // delete this.filterForm.value.minPrice;
    for (const key of Object.keys(this.filterForm.value)) {
      if (this.filterForm.value[key] < 0 || this.filterForm.value[key] === null) {
        if (key === 'minPrice' || key === 'minCapacity') {
          this.filterForm.value[key] = 0;
        } else {
          delete this.filterForm.value[key];
        }
      }
    }
    this.currentFilter = {
      price: { '$gt': this.filterForm.value.minPrice, '$lt': this.filterForm.value.maxPrice },
      capacity: { '$gt': this.filterForm.value.minCapacity, '$lt': this.filterForm.value.maxCapacity },
      region: this.filterForm.value.region,
      city: this.filterForm.value.city,
    }

    this.terrainService.getTerrains({
      filter: this.currentFilter,
      limit: this.limit,
      page: this.page

    })
      .then((res) => {
        this.terrains = res.terrains;
        this.publicationDisplayList = res.terrains;
        this.total = res.total;
      })
      .catch(err => console.log(err))
    console.log(this.filterForm.value);

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

  addEvent(): void {
    if (this.note === 0) {
      this.toastr.info("Note that reservation time must be more than one hour. choose carefully the reservation's time")
      this.note = 1;
    }
    this.requestReservation = [
      ...this.requestReservation,
      {
        start: new Date(),
        end: new Date(),
      },
    ];
  }

  openDetailModal(terrain): void {
    this.terrainService.getDetailTerrain(terrain.id).then((res) => {
      console.log(res)
      this.currentPublication = res.terrain;
      this.markerPositions[0] = res.terrain.position;
      this.center = res.terrain.position;
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
    this.modal.open(this.modalContent, { size: 'xl' });
  }


  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = true;
  }
  changePage(name: string): void {
    // if(name === 'stats'){
    //   this.initMap()
    // }
    this.pageContent = name;
    // tslint:disable-next-line: max-line-length
  }
  confirmReservation(reservation): void {
    if (reservation.start < (new Date())) {
      this.toastr.warning('invalid reservation time');
      this.requestReservation = this.requestReservation.filter((res) => res.start !== reservation.start)
      return;
    } else {
      this.reservationService.reserve({
        terrain: this.currentPublication._id,
        startAt: reservation.start,
        endAt: reservation.end
      })
        .then((succ) => {
          this.requestReservation = this.requestReservation.filter((res) => res.start !== reservation.start)
          this.toastr.success('reservation request successfully added!');
        })
        .catch((err) => console.log(err))
    }
  }
}
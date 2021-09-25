import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { PagesService } from 'src/app/core/service/pages.service';
import { TerrainService } from 'src/app/core/service/terrain.service';
import { UserService } from 'src/app/core/service/user.service';
import { InputService } from 'src/app/core/utiles/input.service';
import { pages } from 'src/app/core/utiles/pages.utils';
import { places } from 'src/app/core/utiles/places';

@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss']
})
export class TerrainComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  center: google.maps.LatLngLiteral = { lat: 36.8, lng: 10.1 };
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];


  public terrainForm!: FormGroup;
  public controlForm: any = null;
  pageSize = 7;
  loader = false;
  subCurrentUser: Subscription | null = null;
  currentUser: any = null;
  value = 1.5;
  pagesRoute = pages.pagesRoute;
  refresh: Subject<any> = new Subject();
  terrains = [];
  publicationDisplayList = [];
  filterText = '';
  pageContent = 'terrain';
  page = 1;
  total = 0;
  limit = 7;
  terrainToUpdate = null;

  cities = [];
  states = [];
  constructor(
    private pagesService: PagesService,
    private inputService: InputService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private terrainService: TerrainService,
    private modal: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.controlForm = this.inputService.getInputConfig('addTerrain');
    this.userService.getCurrentUser()
      .then((suc) => {
        if (suc.code === 1) {
          this.userService.setCurrentUser(suc.user);
          this.currentUser = suc.user;
          this.loader = false;
          if (suc.user.userType !== 'client') {

            this.terrainService.getTerrainsPrivate({
              filter: {},
              limit: this.limit,
              page: this.page
            })
              .then((res) => {
                this.terrains = res.terrains;
                this.publicationDisplayList = res.terrains;
                this.total = res.total;
              });
          }
        } else {
          // affichier toast or something
          this.toastr.warning('Session expired, sign in again');
          this.userService.logout();
        }
      })
      .catch((err) => {
        // affichier toast or something
        this.toastr.warning('There is a problem try again later');
        this.userService.logout();
      });



    this.pagesService.setCurrentIndex(pages.pagesRef.publication);

  }
  addPropUser(): void {
    // console.log(this.currentUser.userType);
    this.userService.updateUser({ user: { userType: "proprietaire" } })
      .then((res) => {
        this.toastr.success("You can add a new field");
        this.router.navigate([pages.pagesRoute.addTerrain]);

      })
      .catch((err) => {
        this.toastr.warning("Something went wrong");
      })

  }
  createForm(): void {
    this.terrainForm = this.fb.group({
      title: [this.terrainToUpdate?.title, Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.titleMinLength),
        Validators.maxLength(this.controlForm.titleMaxLength)
      ])],
      description: [this.terrainToUpdate?.description, Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.descriptionMinLength),
        Validators.maxLength(this.controlForm.descriptionMaxLength)
      ])],
      price: [this.terrainToUpdate?.price, Validators.compose([
        Validators.required,
        Validators.min(this.controlForm.minPrice),
        Validators.max(this.controlForm.maxPrice),
      ])],
      capacity: [this.terrainToUpdate?.capacity, Validators.compose([
        Validators.required,
        Validators.min(this.controlForm.minCapacity),
        Validators.max(this.controlForm.maxCapacity),
      ])],
      region: [],
      city: [],
    }, { validator: [InputService.notEmptyState, InputService.notEmptyCity] });
  }
  detect() {
    const state = this.terrainForm.get('region').value;
    this.cities = [];
    this.terrainToUpdate.city = '';
    this.terrainForm.get('city').setValue('city')
    // if (state !== 'State') {
    this.cities = places.find((el) => el.gov === state).city;
    // }
  }
  submitForm(): void {
    this.loader = true;

    let toUpdate = this.terrainForm.value;
    toUpdate.position = this.markerPositions[0];
    this.terrainService.updateTerrain({
      terrain: toUpdate,
      terrain_id: this.terrainToUpdate.id
    })
      .then((res) => {
        this.toastr.success('terrain updated');
        toUpdate.id = this.terrainToUpdate.id;
        this.terrains[this.terrains.indexOf(this.terrainToUpdate)] = toUpdate;
        this.publicationDisplayList = this.terrains;
        this.cities = [];
        this.states = [];
        this.terrainForm.get('region').setValue('')
        this.terrainForm.get('city').setValue('')
        // this.terrains.forEach((terrain) => {

        // })
      })
      .catch((err) => {
        this.toastr.warning('something went wrong, please try again later');
      })
      .finally(() => {
        this.loader = false;
      });
  }

  goTo(path, data = ''): void {
    path === this.pagesRoute.terrainDetail || path === this.pagesRoute.ownerCalendar ? this.router.navigate([path, data]) : this.router.navigate([path]);
  }

  filter() {
    this.terrainService.getTerrainsPrivate({
      limit: this.limit,
      page: 1,
      filter: {
        title: { "$regex": this.filterText.trim(), "$options": "i" }
      }
    })
      .then((res) => {
        this.terrains = res.terrains;
        this.publicationDisplayList = res.terrains;
        this.total = res.total;
        this.filterText = ''
      })
    // this.publicationDisplayList = this.terrains.filter((el) => {
    //   return el.title.toLowerCase().includes(this.filterText.trim().toLowerCase()) || el.description.toLowerCase().includes(this.filterText.trim().toLowerCase())
    // });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions[0] = event.latLng.toJSON();
  }

  handleEvent(terrain: any): void {
    this.terrainToUpdate = terrain;
    this.createForm();
    this.terrainForm.get('region').setValue(terrain.region);
    this.terrainForm.get('city').setValue(terrain.city);
    this.cities = [];
    this.states = [];
    this.states = places.map(el => el.gov).filter((el) => {
      return el !== terrain.region;
    });
    this.cities = places.find((el) => el.gov === terrain.region).city.filter((el) => el !== terrain.city);

    this.markerPositions[0] = this.terrainToUpdate?.position;
    this.center = this.terrainToUpdate?.position;
    this.refresh.next();
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  deleteTerrain(terrainToDelete): void {

    // this.terrainService.deleteTerrain()
    this.terrains = this.terrains.filter((terrain) => {
      return terrain.id !== terrainToDelete.id;
    })
    this.publicationDisplayList = this.terrains;
    this.terrainService.deleteTerrain(terrainToDelete.id).then((res) => {
      if (res.code === 1) {
        this.toastr.success('terrain successfully deleted')
      }
    })
      .catch(() => this.toastr.warning('something went wrong, plz try again later'));

  }

  pageChanged(e) {
    this.page = e;
    this.terrainService.getTerrainsPrivate({
      limit: this.limit,
      page: this.page
    })
      .then((res) => {
        this.terrains = res.terrains;
        this.publicationDisplayList = res.terrains;
        this.total = res.total;
      })
  }

  changePage(name: string): void {
    this.pageContent = name;
    // tslint:disable-next-line: max-line-length
    name === 'terrain' ? this.publicationDisplayList = this.terrains.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) : this.publicationDisplayList = [];
  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) {
      this.subCurrentUser.unsubscribe();
    }
  }
}

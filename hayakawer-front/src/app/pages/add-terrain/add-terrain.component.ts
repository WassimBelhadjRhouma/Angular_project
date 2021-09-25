import { Component, OnInit, ElementRef } from '@angular/core';
import { PagesService } from 'src/app/core/service/pages.service';
import { pages } from 'src/app/core/utiles/pages.utils';
import Stepper from 'bs-stepper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/utiles/input.service';
import { TerrainService } from 'src/app/core/service/terrain.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { places } from 'src/app/core/utiles/places';

@Component({
  selector: 'app-add-terrain',
  templateUrl: './add-terrain.component.html',
  styleUrls: ['./add-terrain.component.scss']
})
export class AddTerrainComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 36.8, lng: 10.1 };
  zoom = 10;
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  currentStep: number;
  private stepper: Stepper;

  public terrainForm!: FormGroup;
  public controlForm: any = null;
  loader = false;

  states = [];
  cities = [];
  constructor(
    private pagesService: PagesService,
    private terrainService: TerrainService,
    private readonly elementRef: ElementRef,
    private fb: FormBuilder,
    private inputService: InputService,
    private toastr: ToastrService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.controlForm = this.inputService.getInputConfig('addTerrain');
    this.createForm();
    this.states = places.map(el => el.gov);

    this.pagesService.setCurrentIndex(pages.pagesRef.addTerrain);
    const stepperEl = this.elementRef.nativeElement.querySelector('#stepper1');
    stepperEl.addEventListener('show.bs-stepper', event => {
      this.currentStep = event.detail.to;
    });
    this.stepper = new Stepper(stepperEl, {
      linear: true,
      animation: true
    });
  }

  // create form

  createForm(): void {
    this.terrainForm = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.titleMinLength),
        Validators.maxLength(this.controlForm.titleMaxLength)
      ])],
      description: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.descriptionMinLength),
        Validators.maxLength(this.controlForm.descriptionMaxLength)
      ])],
      price: [60, Validators.compose([
        Validators.required,
        Validators.min(this.controlForm.minPrice),
        Validators.max(this.controlForm.maxPrice),
      ])],
      capacity: [10, Validators.compose([
        Validators.required,
        Validators.min(this.controlForm.minCapacity),
        Validators.max(this.controlForm.maxCapacity),
      ])],
      region: ['State'],
      city: ['city'],
    }, { validator: [InputService.notEmptyState, InputService.notEmptyCity] });
  }

  next(nbr: number) {
    this.stepper.to(nbr);
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions[0] = event.latLng.toJSON();
    console.log(this.markerPositions);
  }

  detect() {
    const state = this.terrainForm.get('region').value;
    this.cities = [];
    this.terrainForm.get('city').setValue('city')
    if (state !== 'State') {
      if (state !== 'State') {
        this.cities = places.find((el) => el.gov === state).city;
      }
    }
  }

  addTerrain() {
    const terrain = {
      title: this.terrainForm.get('title').value,
      description: this.terrainForm.get('description').value,
      price: this.terrainForm.get('price').value,
      capacity: this.terrainForm.get('capacity').value,
      region: this.terrainForm.get('region').value,
      city: this.terrainForm.get('city').value,
      position: {
        lat: this.markerPositions[0].lat,
        lng: this.markerPositions[0].lng,
      }
    }
    this.terrainService.addTerrain(terrain)
      .then((res) => {
        if (res.code === 1) {
          this.toastr.success('Terrain successfully created')
          this.router.navigate([pages.pagesRoute.terrain])
        } else if (res.code === -1) {
          this.toastr.warning('Terrain not created')
          this.next(1);
        }
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        this.toastr.warning('Something went wrong, pelase try again later')
        this.next(1);
      })
  }

}

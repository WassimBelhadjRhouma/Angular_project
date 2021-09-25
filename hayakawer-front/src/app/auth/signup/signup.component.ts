import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { InputService } from 'src/app/core/utiles/input.service';
import { places } from 'src/app/core/utiles/places';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public registerForm!: FormGroup;
  public codeResponse: number = null;
  public controlForm: any = null;
  loader = false;
  states = [];
  cities = [];

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const x = places.find((el) => el.gov === 'Ariana').city
    const y = places.map(el => el.gov);
    this.controlForm = this.inputService.getInputConfig('signup');
    this.states = places.map(el => el.gov);

    this.createForm();
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.nameMinLength),
        Validators.maxLength(this.controlForm.nameMaxLength)
      ])],
      lastName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.nameMinLength),
        Validators.maxLength(this.controlForm.nameMaxLength)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.emailPattern)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.passwordPattern)
      ])],
      confirmPassword: [''],
      region: ['State'],
      city: ['city'],
    }, { validator: [InputService.MatchPassword, InputService.notEmptyState, InputService.notEmptyCity,] });
  }

  async detect() {
    const state = this.registerForm.get('region').value;
    this.cities = [];

    if (state !== 'State') {
      this.cities = places.find((el) => el.gov === state).city;
    }
  }

  submitForm(): void {
    this.loader = true;
    this.registerForm.disable();
    this.authService.register(this.registerForm.value)
      .then((res) => {
        this.codeResponse = res.code;
        if (this.codeResponse === -1) {
          this.registerForm.controls.confirmPassword.reset();
          this.registerForm.controls.password.reset();
        }
        else if (this.codeResponse === 1) {
          this.registerForm.reset();
        }
        this.registerForm.enable();
      })
      .catch((err) => {
        this.codeResponse = -2;
      })
      .finally(() => {
        this.loader = false;
      });
  }

}

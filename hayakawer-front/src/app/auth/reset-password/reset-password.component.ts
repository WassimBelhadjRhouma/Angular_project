import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/service/auth.service';
import { InputService } from 'src/app/core/utiles/input.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm!: FormGroup;
  public controlForm: any = null;
  public showPassword = false;
  public showConfirmPassword = false;
  public loader = true;
  public emailCode = '';

  public codeResponse: number = null;
  public rePasswordCodeResponse: number = null;
  public emailConfirmed = false;
  public expiredEmailCode = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private inputService: InputService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params: Params) => {
      this.emailCode = params.confirmationCode;
      this.authService.checkRePasswordToken(this.emailCode)
        .then((res) => {
          console.log(res);
          this.codeResponse = res.code;
          if (this.codeResponse === 1) {
            this.controlForm = this.inputService.getInputConfig('signup');
            this.createForm();
          }
        })
        .catch((err) => {
          this.codeResponse = -1;
        }).finally(() => {
          this.loader = false;
        });
    });
  }

  createForm(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.passwordPattern)
      ])],
      confirmPassword: [''],
    }, { validator: [InputService.MatchPassword] });
  }


  submitForm(): void {
    this.loader = true;
    this.resetPasswordForm.disable();
    this.authService.resetPassword({
      password: this.resetPasswordForm.get('password').value,
      emailCode: this.emailCode
    })
      .then((res) => {
        console.log(res);
        this.rePasswordCodeResponse = res.code;
        if (this.rePasswordCodeResponse === -1) {
          this.resetPasswordForm.reset();
        }
        else if (this.rePasswordCodeResponse === 1) {
          this.resetPasswordForm.reset();
        }
        this.resetPasswordForm.enable();
      })
      .catch((err) => {
        this.rePasswordCodeResponse = -1;
      })
      .finally(() => {
        this.loader = false;
      });
  }
}

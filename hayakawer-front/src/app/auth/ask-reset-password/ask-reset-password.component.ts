import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { InputService } from 'src/app/core/utiles/input.service';

@Component({
  selector: 'app-ask-reset-password',
  templateUrl: './ask-reset-password.component.html',
  styleUrls: ['./ask-reset-password.component.scss']
})
export class AskResetPasswordComponent implements OnInit {

  public askRePasswordForm!: FormGroup;
  public controlForm: any = null;
  public codeResponse: number = null;

  loader = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private inputService: InputService
  ) { }

  ngOnInit(): void {
    this.controlForm = this.inputService.getInputConfig('signup');
    this.createForm();
  }

  createForm(): void {
    this.askRePasswordForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.emailPattern)
      ])]
    });
  }


  submitForm(): void {
    this.loader = true;
    this.askRePasswordForm.disable();
    this.authService.askResetPassword(this.askRePasswordForm.get('email').value)
      .then((res) => {
        console.log(res);
        this.codeResponse = res.code;
        this.askRePasswordForm.enable();
      })
      .catch((err) => {
        this.codeResponse = -2;
      })
      .finally(() => {
        this.askRePasswordForm.reset();
        this.loader = false;
      });
  }

}

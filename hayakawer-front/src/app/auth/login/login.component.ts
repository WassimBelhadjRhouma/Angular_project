import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { InputService } from 'src/app/core/utiles/input.service';
import { SocialAuthService, SocialUser, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/service/user.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public controlForm: any = null;
  public codeResponse: number = null;


  showPassword = false;
  showConfirmPassword = false;
  loader = false;

  socialUser: SocialUser;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private inputService: InputService,
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private router: Router,
    private storageService: StorageService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.controlForm = this.inputService.getInputConfig('login');
    this.createForm();
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID, { scope: 'email' }).
      then((res) => {
        this.authService.FBsignIn(res.authToken)
          .then((response) => {
            if (response.code === 2 || response.code === 1) {
              this.storageService.setToken(response.token);
              this.userService.setCurrentUser(response.user);
              this.toastr.success(`Welcome ${response.user.firstName}`);
              this.router.navigate(['/pages/home']);
            } else {
              this.codeResponse = response.code;
            }
          })
          .catch((err) => {
            this.toastr.warning(`can't respond, try again later`);
          });
      })
      .catch((err) => {
        this.toastr.warning(`can't respond, try again later`);
      });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, { scope: 'email' })
      .then((res) => {
        this.authService.googleSignIn(res.authToken)
          .then((response) => {
            if (response.code === 2 || response.code === 1) {
              this.storageService.setToken(response.token);
              this.userService.setCurrentUser(response.user);
              this.toastr.success(`Welcome ${response.user.firstName}`);
              this.router.navigate(['/pages/home']);
            } else {
              this.codeResponse = response.code;
            }
          })
          .catch(err => this.toastr.warning("Can't respond"));
      });
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.emailPattern)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.passwordPattern)
      ])]
    });
  }

  submitForm(): void {

    this.loader = true;
    this.loginForm.disable();
    this.authService.login(this.loginForm.value)
      .then((res) => {
        this.codeResponse = res.code;
        if (this.codeResponse === -1 || this.codeResponse === -2) {
          this.loginForm.controls.password.reset();
        }
        else if (this.codeResponse === 1) {
          this.loginForm.reset();
          this.storageService.setToken(res.token);
          this.userService.setCurrentUser(res.user);
          this.toastr.success(`Welcome ${res.user.firstName}`);
          this.router.navigate(['/pages/home']);
        }
      })
      .catch((err) => {
        this.loginForm.controls.password.reset();
        this.codeResponse = -3;

      })
      .finally(() => {
        this.loader = false;
        this.loginForm.enable();
      });
  }
}

import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/utiles/input.service';
import { PagesService } from 'src/app/core/service/pages.service';
import { pages } from '../../core/utiles/pages.utils';
import { UserService } from 'src/app/core/service/user.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { places } from 'src/app/core/utiles/places';


// Profile Component
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public isCollapsed = true;
  public profileForm!: FormGroup;
  public updatePasswordForm!: FormGroup;
  public controlForm: any = null;
  showPassword = false;
  showConfirmPassword = false;
  showCurrentPassword = false;
  public codeResponse: number = null;
  subCurrentUser: Subscription | null = null;
  editProfile = false;
  loader = false;
  responseCode = 0;
  passwordLoader = false;

  states = [];
  cities = [];

  currentUser: any = null;
  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService,
    private inputService: InputService,
    private userService: UserService,
    private toastr: ToastrService,
    private _modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    this.pagesService.setCurrentIndex(pages.pagesRef.profile);
    this.states = places.map(el => el.gov);
    this.controlForm = this.inputService.getInputConfig('signup');
    this.subCurrentUser = this.userService.subCurrentUser()
      .subscribe((user: any) => {
        this.currentUser = user;
        if (user) {
          if (user.region?.length > 0) {
            this.states = this.states.filter((el) => {
              return el !== user?.region;
            });
            this.cities = places.find((el) => el.gov === user?.region).city.filter((el) => el !== this.currentUser?.city);

          }
        }
        // }
        this.createForm();
        this.profileForm.disable();
      });
  }

  createForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.currentUser?.firstName, Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.nameMinLength),
        Validators.maxLength(this.controlForm.nameMaxLength)
      ])],
      lastName: [this.currentUser?.lastName, Validators.compose([
        Validators.required,
        Validators.minLength(this.controlForm.nameMinLength),
        Validators.maxLength(this.controlForm.nameMaxLength)
      ])],
      region: [this.currentUser?.region?.length > 0 ? this.currentUser?.region : 'State'],
      city: [this.currentUser?.city?.length > 0 ? this.currentUser?.city : 'city'],
    }, { validator: [InputService.notEmptyState, InputService.notEmptyCity] });

    this.updatePasswordForm = this.fb.group({
      currentPassword: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.passwordPattern)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.controlForm.passwordPattern)
      ])],
      confirmPassword: [''],
    }, { validator: [InputService.MatchPassword, InputService.NotMatchPassword] });
  }

  // Open the modal component
  open(name: string) {
    this._modalService.open(MODALS[name]);
  }

  detect() {
    const state = this.profileForm.get('region').value;
    this.cities = [];
    this.currentUser.city = '';
    this.profileForm.get('city').setValue('city')
    if (state !== 'State') {
      if (state !== 'State') {
        this.cities = places.find((el) => el.gov === state).city;
      }
    }
  }

  updatePassword(): void {
    this.passwordLoader = true;
    this.updatePasswordForm.disable();
    this.userService.updateUser({ password: this.updatePasswordForm.get('password').value, currentPassword: this.updatePasswordForm.get('currentPassword').value })

      .then((res) => {
        if (res.code === 1) {
          this.toastr.success('password updated');
          this.updatePasswordForm.reset();
        }
        else {
          this.responseCode = res.code;
        }
      })
      .catch((err) => {
        this.toastr.warning('password incorrect');
      })
      .finally(() => {
        this.updatePasswordForm.enable();
        this.updatePasswordForm.controls.currentPassword.reset();
        this.passwordLoader = false;
      });
  }


  updateProfile(): void {
    this.passwordLoader = true;
    this.userService.updateUser({ user: this.profileForm.value })
      .then((res) => {
        this.responseCode = res.code;
        this.toastr.success('Profile updated');
        this.currentUser.firstName = this.profileForm.controls.firstName?.value || this.currentUser.firstName;
        this.currentUser.lastName = this.profileForm.controls.lastName?.value || this.currentUser.lastName;
        this.currentUser.email = this.profileForm.controls.email?.value || this.currentUser.email;
      })
      .catch((err) => {
        this.toastr.warning('Something went wrong');
      })
      .finally(() => {
        this.loader = false;
        this.passwordLoader = false;
        this.profileForm.disable();
      })
  }

  deleteAccount(): void {
    this.userService.deleteUser()
      .then(() => {
        this.toastr.error('Deleted Account !');
        this.userService.logout();

      })
      .catch(() => this.toastr.warning('something went wrong'));
  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) {
      this.subCurrentUser.unsubscribe();
    }
  }
}

@Component({
  providers: [ProfileComponent],
  selector: 'ngbd-modal-confirm',
  template: `

  <!-- Title and cancel icon -->

  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Profile deletion</h4>
    <span type="button" class="close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </span>
  </div>

  <!-- Text inside -->

  <div class="modal-body">
    <p><strong> <span class="fas fa-exclamation-circle" style="color:red"></span> Are you sure you want to delete your profile?</strong></p>
    <p><span class="fas fa-exclamation-circle" style="color:red"></span> All information associated to this user profile will be permanently deleted.
    <span class="text-danger">This operation can not be undone.</span>
    </p>
  </div>

  <!--Cancel and ok buttons -->
  <div class="modal-footer">
    <button type="button" class="btn btn-dark-light" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="deleteAccount()">Ok</button>
  </div>
  `
})
export class NgbdModalDeleteAccount {
  constructor(public modal: NgbActiveModal,
    public profileComponent: ProfileComponent
  ) { }

  deleteAccount(): void {
    this.profileComponent.deleteAccount();
    this.modal.close('Ok click');
  }

}

const MODALS: { [name: string]: Type<any> } = {
  focusFirst: NgbdModalDeleteAccount,
};
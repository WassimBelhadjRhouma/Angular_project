import { Component, OnInit, Type } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from '../profile.component';

@Component({
  selector: 'ngbd-modal-confirm',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {

  constructor(
    public modal: NgbActiveModal,
    public profileComponent: ProfileComponent
  ) { }

  deleteAccount(): void {
    this.profileComponent.deleteAccount();
    this.modal.close('Ok click');
  }

}

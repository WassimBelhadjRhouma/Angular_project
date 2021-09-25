import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PagesService } from 'src/app/core/service/pages.service';
import { UserService } from 'src/app/core/service/user.service';
import { InputService } from 'src/app/core/utiles/input.service';
import { pages } from 'src/app/core/utiles/pages.utils';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  loader = false;
  subCurrentUser: Subscription | null = null;
  currentUser: any = null;
  constructor(
    private pagesService: PagesService,
    private inputService: InputService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.pagesService.setCurrentIndex(pages.pagesRef.terrain);
    this.subCurrentUser = this.userService.subCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  addPropUser(): void {
    // console.log(this.currentUser.userType);
    this.userService.updateUser({ user: { userType: "proprietaire" } })
      .then((res) => {
        this.toastr.success("bueno");
        this.router.navigate([pages.pagesRoute.addTerrain]);

      })
      .catch((err) => {
        this.toastr.warning("Something went wrong");
      })

  }

  ngOnDestroy(): void {
    if (this.subCurrentUser) {
      this.subCurrentUser.unsubscribe();
    }
  }

}

import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PagesService } from '../core/service/pages.service';
import { UserService } from '../core/service/user.service';
import { pages } from '../core/utiles/pages.utils';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
  collapsed = true;
  loader = true;
  subCurrentIndexPage: Subscription | null = null;
  currentIndex!: number;
  pagesRef = pages.pagesRef;
  pagesRoute = pages.pagesRoute;
  publicationChilds = false;
  firstName = 'user Name';
  currentUser: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private pagesService: PagesService,
    private toastr: ToastrService,

  ) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .then((suc) => {
        if (suc.code === 1) {
          this.userService.setCurrentUser(suc.user);
          this.firstName = suc.user.firstName;
          this.currentUser = suc.user;
          this.loader = false;
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
    this.subCurrentIndexPage = this.pagesService.subCurrentIndex()
      .subscribe((index) => {
        setTimeout(() => this.currentIndex = index);
      });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.toastr.success('logout');
    this.userService.logout();
  }

  ngOnDestroy(): void {
    if (this.subCurrentIndexPage) {
      this.subCurrentIndexPage.unsubscribe();
    }
  }
}

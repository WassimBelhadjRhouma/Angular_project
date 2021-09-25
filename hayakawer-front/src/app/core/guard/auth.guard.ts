import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';



// user connected and try go to auth root
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService) {
  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

// user not connected and try to go page route
@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['pages']);
      return false;
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';


@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private storageService: StorageService) { }

  private baseApiUrl = environment.api + 'auth/';

  register(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseApiUrl + 'signup', data)
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  resetPassword(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseApiUrl + 'reset-password', data)
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  askResetPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseApiUrl + 'ask-reset-password', { email })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  checkRePasswordToken(emailCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseApiUrl + `check-token?emailCode=${emailCode}`)
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  emailConfirmation(emailCode: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseApiUrl + `confirm-email?emailCode=${emailCode}`)
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  FBsignIn(access_token: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseApiUrl + 'signin/fb', { access_token })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  googleSignIn(access_token: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseApiUrl + 'signin/google', { access_token })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  login(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseApiUrl + 'signin', data)
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  isLoggedIn(): boolean {
    if (this.storageService.getToken()) {
      return true;
    } else {
      return false;
    }
  }

}

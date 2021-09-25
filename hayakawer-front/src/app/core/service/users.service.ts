import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

// import * as axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) { }

  private baseApiUrl = environment.api + 'users/';


  getUsers(data = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.post(this.baseApiUrl, data, {
          headers: {
            'Authorization': `Bearer ${this.storageService.getToken()}`
          }
        })
          .toPromise()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
  deleteUser(user_id): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.delete(this.baseApiUrl + `delete?id=${user_id}`, {
          headers: {
            'Authorization': `Bearer ${this.storageService.getToken()}`
          }
        })
          .toPromise()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
  updateUser(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.put(this.baseApiUrl + 'update', data, {
          headers: {
            'Authorization': `Bearer ${this.storageService.getToken()}`
          }
        })
          .toPromise()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  getUserStats(data = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.post(this.baseApiUrl + 'stats', data, {
          headers: {
            'Authorization': `Bearer ${this.storageService.getToken()}`
          }
        })
          .toPromise()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
  getTerrainStats(data = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.post(this.baseApiUrl + 'terrain/stats', data, {
          headers: {
            'Authorization': `Bearer ${this.storageService.getToken()}`
          }
        })
          .toPromise()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
  getTotalStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.get(this.baseApiUrl + 'stats', {
          headers: {
            'Authorization': `Bearer ${this.storageService.getToken()}`
          }
        })
          .toPromise()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
}

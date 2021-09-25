import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  private baseApiUrl = environment.api + 'reservation/';

  getReservationOwner(terrain: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseApiUrl + `?terrain=${terrain}`)
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  reserve(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.post(this.baseApiUrl + 'reserve', data, {
          headers: {
            "Authorization": `Bearer ${this.storageService.getToken()}`
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

  deleteReservation(reservation_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.delete(this.baseApiUrl + `cancel?reservation_id=${reservation_id}`, {
          headers: {
            "Authorization": `Bearer ${this.storageService.getToken()}`
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


  acceptReservation(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.put(this.baseApiUrl + 'accept', data, {
          headers: {
            "Authorization": `Bearer ${this.storageService.getToken()}`
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

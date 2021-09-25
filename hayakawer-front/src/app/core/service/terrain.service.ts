import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {

  private currentPublication = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  private baseApiUrl = environment.api + 'terrain/';

  subcurrentPublication(): Observable<null> {
    return this.currentPublication;
  }
  setcurrentPublication(publication: any): void {
    this.currentPublication.next(publication);
  }

  addTerrain(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.post(this.baseApiUrl + 'add', data, {
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
  getTerrainsPrivate(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.post(this.baseApiUrl + 'owner', data, {
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

  getDetailTerrain(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.get(this.baseApiUrl + `detail?id=${id}`, {
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
  deleteTerrain(terrain_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.delete(this.baseApiUrl + `delete?terrain=${terrain_id}`, {
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
  updateTerrain(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.put(this.baseApiUrl + `update`, data, {
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


  getTerrains(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageService.getToken()) {
        this.http.post(this.baseApiUrl + 'client', data, {
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

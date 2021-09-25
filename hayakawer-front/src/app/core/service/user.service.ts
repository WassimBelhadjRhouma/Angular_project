import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable()
export class UserService {
    private currentUser = new BehaviorSubject<any>(null);

    constructor(
        private http: HttpClient,
        private router: Router,
        private storageService: StorageService
    ) { }

    private baseApiUrl = environment.api + 'user/';


    subCurrentUser(): Observable<null> {
        return this.currentUser;
    }
    setCurrentUser(user: any): void {
        this.currentUser.next(user);
    }

    getCurrentUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.storageService.getToken()) {
                this.http.get(this.baseApiUrl, {
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

    deleteUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.storageService.getToken()) {
                this.http.delete(this.baseApiUrl + 'delete', {
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

    logout(): void {
        this.storageService.clearToken();
        this.setCurrentUser(null);
        this.router.navigate(['']);
    }

}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../service/storage.service';


@Injectable()
export class BearerInterceptorService implements HttpInterceptor {

    constructor(private storageService: StorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.storageService.getToken();
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                },
            });
            return next.handle(req);
        } else {
            return next.handle(req);
        }
    }
}


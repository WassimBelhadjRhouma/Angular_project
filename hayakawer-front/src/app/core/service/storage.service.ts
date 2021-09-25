import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    private storageJwtKey = 'hayaKawerToken';
    getToken(): string {
        return localStorage.getItem(this.storageJwtKey);
    }

    setToken(token: string): void {
        localStorage.setItem(this.storageJwtKey, token);
    }

    clearToken(): void {
        localStorage.removeItem(this.storageJwtKey);
    }
}
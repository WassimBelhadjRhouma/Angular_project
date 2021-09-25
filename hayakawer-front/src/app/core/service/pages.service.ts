import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private currentIndex = new BehaviorSubject<number>(1);

  constructor() { }

  subCurrentIndex(): Observable<number> {
    return this.currentIndex;
  }

  setCurrentIndex(index: number): void {
    this.currentIndex.next(index);
  }
}

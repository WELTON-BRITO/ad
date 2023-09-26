import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isActive = new Subject<boolean>();
  public loader = this.isActive.asObservable();

  show() {
    this.isActive.next(true);
  }

  hide() {
    this.isActive.next(false);
  }
}
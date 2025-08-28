import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Taskmodal {
  
private showModalSubject = new Subject<void>();
  showModal$ = this.showModalSubject.asObservable();

  openModal() {
    this.showModalSubject.next();
  }
}

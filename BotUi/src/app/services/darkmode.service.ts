import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {

  private darkmode= new BehaviorSubject<boolean>(false);

  constructor() { }

  setDarkmode(value: boolean){
    this.darkmode.next(value);
  }

 

  getDarkmode(){
    return this.darkmode.getValue();
  }
}

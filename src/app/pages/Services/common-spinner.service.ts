import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CommonSpinnerService {

  constructor(private _spinnerService : NgxSpinnerService) { }

  showSpinner()
  {
    this._spinnerService.show();
  }

  hideSpinner()
  {
    this._spinnerService.hide();
  }
  
}

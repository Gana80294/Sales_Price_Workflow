import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _httpService : HttpService) { }

  isLogin()
  {
    return !!localStorage.getItem('SalesToken');
  }

  getPasswordValidity(userId) : Promise<any>
  {
    return this._httpService.get(`Authentication/GetPasswordValidity?userId=${userId}`).toPromise();
  }



  authentication(authUser) : Observable<any>
  {
    return this._httpService.post('Authentication/Authentication', authUser);
  }

  checkUser(userId) : Observable<any>
  {
    return this._httpService.get(`Authentication/CheckUser?userId=${userId}`);
  }

  sendMailToGenerateOtp(userMail) : Observable<any>
  {
    const URL = 'Authentication/GenerateOtp';
    return this._httpService.post(URL, userMail);
  }

  confirmOtp(userId, otp) : Observable<any>
  {
    const URL = `Authentication/ConfirmOtp?userId=${userId}&otp=${otp}`;
    return this._httpService.get(URL);
  }

  changePassword(resetPassword) : Observable<any>
  {
    const URL = `Authentication/ForgotPassword`;
    return this._httpService.post(URL, resetPassword);
  }

  
}

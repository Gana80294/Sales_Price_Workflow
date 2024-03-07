import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  userName$ = new Subject();

  constructor() { }

  getUserName(userName)
  {
    this.userName$.next(userName);
  }

  decryptToken(token)
  {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }
  
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, TimeoutError } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';

import { ProcessHttpmsgService } from './process-httpmsg.service';
import { CookieService } from 'ngx-cookie-service';

import { map, delay, catchError} from 'rxjs/operators';

import { User } from '../shared/user';
import { baseDomain, baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User = {
    SSN: null,
    Name: '',
    Password: '',
    PhoneNo: null,
    PhoneVerified: false,
    EmailIds: null,
    Balance: null,
    PBAVerified: false,
    BankID: null,
    BANumber: null,
    AddBankAccs: null
  }

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  login(user: User): Observable<any> {
    console.log('user', user);
    // debugger;
    return this.http.post(baseURL + 'users/login', user)
      .pipe(map(res => res), catchError(error => {
        // debugger;
        return this.processHTTPMsgService.handleError(error);
      }));
  }

  signup(user: User): Observable<any> {
    console.log('user: ', user);

    return this.http.post(baseURL + 'users/signup', user)
      .pipe(map(res => res), catchError(error => {
        // debugger;
        return this.processHTTPMsgService.handleError(error);
      }));
  }

  getSingleUserBySSN(): Observable<any> {
    const SSN = this.cookieService.get('Id');

    return this.http.get(baseURL + 'users/' + SSN)
    .pipe(map(res => res), catchError(error => {
      // debugger;
      return this.processHTTPMsgService.handleError(error);
    }));
  }

  updateSingleUserBySSN(data): Observable<any> {
    let SSN = '';
    if ( data.key === 'PhoneNo' ) {
      SSN = this.cookieService.get('MobileNo');
    } else {
      SSN = this.cookieService.get('Id');
    }
    

    return this.http.put(baseURL + 'users/' + SSN, data)
    .pipe(map(res => res), catchError(error => {
      // debugger;
      return this.processHTTPMsgService.handleError(error);
    }));
  }
}

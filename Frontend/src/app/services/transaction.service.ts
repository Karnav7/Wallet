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
import { SendTransaction } from '../shared/sendTransaction';
import { baseDomain, baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

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

  private sendtransaction: SendTransaction = {
    Identifier: null,
    Amount: null,
    Date_Time: null,
    Memo: null,
    Cancel_Reason: null,
    SSN: null,
    Balance: null
  }

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  sendTransactionData(data: SendTransaction): Observable<any> {
    console.log('data', data);

    return this.http.post(baseURL + 'sendtransaction', data)
      .pipe(map(res => res), catchError(error => {
        // debugger;
        return this.processHTTPMsgService.handleError(error);
      }));
  }
}

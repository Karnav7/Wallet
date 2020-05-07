import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Routes, Router } from '@angular/router';
import { User } from '../shared/user';

import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TransactionService } from '../services/transaction.service';
import { SendTransaction } from '../shared/sendTransaction';
import { RequestTransaction } from '../shared/requestTransaction';
import { SendTransactionMonthlyStatement, RequestTransactionMonthlyStatement} from '../shared/monthlyStatement';


@Component({
  selector: 'app-monthly-statements',
  templateUrl: './monthly-statements.component.html',
  styleUrls: ['./monthly-statements.component.scss']
})
export class MonthlyStatementsComponent implements OnInit {

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
  };

  username: string;

  sendMonthlyStatement: SendTransactionMonthlyStatement = {
    Month: null,
    Month_Name: null,
    STid: null,
    Date_Time: null,
    Amount: null,
    Memo: null,
    Cancel_Reason: null,
    Identifier: null,
    SSN: null
  };

  sendStatementList: SendTransactionMonthlyStatement[] = [];

  requestMonthltyStatement: RequestTransactionMonthlyStatement = {
    Month: null,
    Month_Name: null,
    RTid: null,
    Date_Time: null,
    Amount: null,
    memo: null,
    SSN: null,
    Identifier: null,
    Percentage: null
  };

  requestStatementList: RequestTransactionMonthlyStatement[] = [];

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private transactionService: TransactionService,
    private router: Router,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.username = this.cookieService.get('Name');
    this.authService.getSingleUserBySSN().subscribe((data) => {
      console.log('data: ', data);
      if ( data.success === true ) {
        this.user = data.user;
        console.log('user: ', this.user);

        // get monthly send transaction statements
        this.sendStatementList = [];
        this.transactionService.getMonthlySendTransactionStatements(this.user.SSN).subscribe((statRes) => {
          if ( statRes.success === true ) {
            console.log('yo');
            for (let i = 0; i < statRes.result.length; i++ ) {
              console.log('res', statRes.result[i]);
              this.sendStatementList.push(statRes.result[i]);
            }
          }
        });

        this.requestStatementList = [];
        this.transactionService.getMonthlyRequestTransactionStatements(this.user.SSN).subscribe((statRes) => {
          if ( statRes.success === true ) {
            console.log('yo');
            for (let i = 0; i < statRes.result.length; i++ ) {
              console.log('res', statRes.result[i]);
              this.requestStatementList.push(statRes.result[i]);
            }
          }
        });

        // if ( this.user.EmailIds.length > 0 ) {
        //   this.user.EmailIds.forEach((email) => {
        //     this.emailIds.push(email);
        //   });
        //   console.log('emails: ', this.emailIds);
        // }

        // if ( this.user.AddBankAccs.length > 0 ) {
        //   this.user.AddBankAccs.forEach((bank) => {
        //     bank.BankName = this.getBankName(bank.BankID);
        //   });
        // }
      }
    });
  }

  signOut() {
    
    this.router.navigate(['/']).then(() => {
      this.snackBar.open('Bye, ' + this.cookieService.get('Name') + '!', 'OK', {
        duration: 3000
      });
      this.cookieService.deleteAll('/', '', false);
    });
  }

}

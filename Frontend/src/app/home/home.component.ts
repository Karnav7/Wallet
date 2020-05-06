import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Routes, Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { User } from '../shared/user';

import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TransactionService } from '../services/transaction.service';
import { SendTransaction } from '../shared/sendTransaction';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
  balance: number;

  @ViewChild("balanceText", {static: false}) balanceText: ElementRef;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    public snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet
  ) {
    this.authService.getSingleUserBySSN().subscribe((data) => {
      console.log('yodata: ', data);
      if ( data.success === true ) {
        this.user = data.user;
        this.balance = this.user.Balance;
        console.log('youser: ', this.user);

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

  ngOnInit(): void {
    this.username = this.cookieService.get('Name');
    // this.authService.getSingleUserBySSN().subscribe((data) => {
    //   console.log('data: ', data);
    //   if ( data.success === true ) {
    //     this.user = data.user;
    //     console.log('user: ', this.user);

    //     // if ( this.user.EmailIds.length > 0 ) {
    //     //   this.user.EmailIds.forEach((email) => {
    //     //     this.emailIds.push(email);
    //     //   });
    //     //   console.log('emails: ', this.emailIds);
    //     // }

    //     // if ( this.user.AddBankAccs.length > 0 ) {
    //     //   this.user.AddBankAccs.forEach((bank) => {
    //     //     bank.BankName = this.getBankName(bank.BankID);
    //     //   });
    //     // }
    //   }
    // });
  }

  public getUser(): User {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
    this.balance = this.user.Balance;
    console.log('updated user: ', this.user);
  }

  signOut() {
    
    this.router.navigate(['/']).then(() => {
      this.snackBar.open('Bye, ' + this.cookieService.get('Name') + '!', 'OK', {
        duration: 3000
      });
      this.cookieService.deleteAll('/', '', false);
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  recieveMoney() {}

  sendMoney() {
    this._bottomSheet.open(SendMoney);
  }

}

@Component({
  selector: 'app-sendMoney',
  templateUrl: './sendMoney.html',
  styleUrls: ['./home.component.scss']
})
export class SendMoney {

  recipient = '';
  memo = '';
  amount = '';

  private sendtransaction: SendTransaction = {
    Identifier: null,
    Amount: null,
    Date_Time: null,
    Memo: null,
    Cancel_Reason: null,
    SSN: null,
    Balance: null
  }

  // private user: User = {
  //   SSN: null,
  //   Name: '',
  //   Password: '',
  //   PhoneNo: null,
  //   PhoneVerified: false,
  //   EmailIds: null,
  //   Balance: null,
  //   PBAVerified: false,
  //   BankID: null,
  //   BANumber: null,
  //   AddBankAccs: null
  // };

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SendMoney>,
    private authService: AuthService,
    private cookieService: CookieService,
    private transactionService: TransactionService,
    private router: Router,
    public snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet
    ) {}

  sendMoney() {
    let hc: HomeComponent = new HomeComponent(this.authService, this.cookieService, this.router, this.snackBar, this._bottomSheet);
    setTimeout(() => {
      let user1: User = hc.getUser();
      console.log('user1: ', user1); 
      console.log('hcuser: ', hc.user);
      const numRegex = /^[0-9]+$/;
      const emailRegex = /^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\.([a-zA-Z]{2,5})$/;
      const amountRegex = /^[0-9]+\.[0-9][0-9]$/;
      if ( this.recipient.match(numRegex) ) {
        if ( this.recipient.length === 10 && this.amount.match(amountRegex) ) {
          console.log('yo ');
          this.sendtransaction.Identifier = this.recipient.trim();
          this.sendtransaction.Memo = this.memo.trim();
          this.sendtransaction.SSN = user1.SSN;
          this.sendtransaction.Balance = user1.Balance;
          this.sendtransaction.Amount = +this.amount;
          console.log('sendData: ', this.sendtransaction);
          this.transactionService.sendTransactionData(this.sendtransaction).subscribe((data)=> {
            if ( data.success === true ) {
              let bal = user1.Balance - +this.amount;
              user1.Balance = bal;
              
              this.snackBar.open('Transaction Completed Successfully!', 'OK', {
                duration: 3000
              });
              
              
              this._bottomSheetRef.afterDismissed().subscribe(() => {
                hc = new HomeComponent(this.authService, this.cookieService, this.router, this.snackBar, this._bottomSheet);
                hc.setUser(user1);
                hc.balanceText.nativeElement.innerHTML = 'Balance: $' + user1.Balance;
              });
              this._bottomSheetRef.dismiss();
            } else {
              this.snackBar.open('Transaction failed, try again!', 'OK', {
                duration: 3000
              });
            }
          });
        } else {
          this.snackBar.open('Error! Phone Number should be of 10 digits', 'OK', {
            duration: 5000
          });
        }
      } else {
        if ( this.recipient.match(emailRegex) && this.amount.match(amountRegex) ) {
          console.log('yo');
          this.sendtransaction.Identifier = this.recipient.trim();
          this.sendtransaction.Memo = this.memo.trim();
          this.sendtransaction.SSN = user1.SSN;
          this.sendtransaction.Balance = user1.Balance;
          this.sendtransaction.Amount = +this.amount;
          console.log('sendData: ', this.sendtransaction);
          this.transactionService.sendTransactionData(this.sendtransaction).subscribe((data)=> {
            if ( data.success === true ) {
              let bal = user1.Balance - +this.amount;
              user1.Balance = bal;
              
              this.snackBar.open('Transaction Completed Successfully!', 'OK', {
                duration: 3000
              });
              
              
              this._bottomSheetRef.afterDismissed().subscribe(() => {
                hc = new HomeComponent(this.authService, this.cookieService, this.router, this.snackBar, this._bottomSheet);
                hc.setUser(user1);
                hc.balanceText.nativeElement.innerHTML = 'Balance: $' + user1.Balance;
              });
              this._bottomSheetRef.dismiss();
            } else {
              this.snackBar.open('Transaction failed, try again!', 'OK', {
                duration: 3000
              });
            }
          });
        } else {
          this.snackBar.open('Error! Email not in valid format', 'OK', {
            duration: 5000
          });
        }
      }
    }, 2000);
    
  }
}

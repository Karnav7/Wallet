import { Component, OnInit } from '@angular/core';
import {MatCard, MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldAppearance } from '@angular/material/form-field';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../shared/user';

import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { baseDomain } from '../shared/baseurl';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'Login';
  mobPlaceHolder = '';
  mobileNo: string;
  password: string;
  SSN: string;
  Name: string;
  sPassword: string;
  scPassword: string;
  smobileNo: string;

  showSignUp = false;

  mobileNoControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.minLength(10)
  ]);
  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25)
  ]);
  ssnControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.minLength(9)
  ]);
  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30)
  ]);
  sPasswordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);
  scPasswordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);
  smobileNoControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
    Validators.minLength(10)
  ]);
  matcher = new MyErrorStateMatcher();

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

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.user.PhoneNo = +this.mobileNo;
    this.user.Password = this.password;
    console.log('user: ', this.user);

    this.authService.login(this.user).subscribe((data) => {
      console.log('data: ', data);
      if ( data.success === true ) {
        this.user = data.user;

        this.cookieService.set('Id', data.user.SSN, 30, '/', '', false);
        this.cookieService.set('Name', data.user.Name, 30, '/', '', false);
        this.cookieService.set('MobileNo', data.user.PhoneNo, 30, '/', '', false);

        this.router.navigate(['/home']).then(() => {
          this.snackBar.open('Welcome to Wallet, '  + data.user.Name + '!', 'OK', {
            duration: 3000
          });
        });
      } else if ( data.success === false && data.status === 'Wrong Password!') {
        this.snackBar.open('Password does not match!', 'OK', {
          duration: 3000
        });
      } else if ( data.success === false && data.status === 'User not found!') {
        this.snackBar.open('User not found, Kindly do signup!', 'OK', {
          duration: 3000
        });
      }
    });
  }

  signup() {
    if ( this.sPassword === this.scPassword ) {
      this.user.SSN = +this.SSN;
      this.user.Name = this.Name;
      this.user.Password = this.sPassword;
      this.user.PhoneNo = +this.smobileNo;
      console.log('user: ', this.user);

      this.authService.signup(this.user).subscribe((data) => {
        console.log('data: ', data);
        
        if ( data.success === true ) {
          this.user = data.user[0];

          this.cookieService.set('Id', data.user[0].SSN, 30, '/', '', false);
          this.cookieService.set('Name', data.user[0].Name, 30, '/', '', false);
          this.cookieService.set('MobileNo', data.user[0].PhoneNo, 30, '/', '', false);

          this.router.navigate(['/home']).then(() => {
            this.snackBar.open('Welcome to Wallet, '  + data.user[0].Name + '!', 'OK', {
              duration: 3000
            });
          });
        } else if ( data.success === false && data.status === 'user exists' ) {
          this.snackBar.open('User already exists, try Login!', 'OK', {
            duration: 3000
          });
        } else if ( data.success === false && data.status === 'error' ) {
          this.snackBar.open('Something went wrong!', 'OK', {
            duration: 3000
          });
        }
      });
    } else {
      this.snackBar.open('Password does not match!', 'OK', {
        duration: 3000
      });
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.mobPlaceHolder = 'Only Numbers allowed';
      return false;
    }
    this.mobPlaceHolder = '';
    return true;

  }

  showSignUpForm() {
    this.showSignUp = true;
    this.title = 'SignUp';
  }

  showLoginForm() {
    this.showSignUp = false;
    this.title = 'Login';
  }

}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Routes, Router } from '@angular/router';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { User } from '../shared/user';

import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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
  SSN: number;
  Name: string;
  Password: string;
  PhoneNo: number;

  disableSSN: boolean = true;
  disableName: boolean = true;
  disablePassword: boolean = true;
  disablePhoneNo: boolean = true;

  isEditSSN: boolean = false;
  isEditName: boolean = false;
  isEditPassword: boolean = false;
  isEditPhoneNo: boolean = false;

  ssnControl = new FormControl({value: this.SSN, disabled: this.disableSSN}, [
    Validators.pattern('[0-9]*'),
    Validators.minLength(10)
  ]);
  nameControl = new FormControl({value: this.Name, disabled: this.disableName}, [
    Validators.minLength(3)
  ]);
  passwordControl = new FormControl({value: this.Password, disabled: this.disablePassword}, [
    Validators.minLength(3)
  ]);
  phoneControl = new FormControl({value: this.PhoneNo, disabled: this.disablePhoneNo}, [
    Validators.pattern('[0-9]*'),
    Validators.minLength(10)
  ])
  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.username = this.cookieService.get('Name');
    this.authService.getSingleUserBySSN().subscribe((data) => {
      console.log('data: ', data);
      if ( data.success === true ) {
        this.user = data.user;
        console.log('user: ', this.user);
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // this.mobPlaceHolder = 'Only Numbers allowed';
      return false;
    }
    // this.mobPlaceHolder = '';
    return true;

  }

  // For SSN
  editSSN() {
    // this.disableSSN = false;
    this.isEditSSN = true;
    this.ssnControl = new FormControl({value: this.user.SSN, disabled: false}, [
      Validators.pattern('[0-9]*'),
      Validators.minLength(10)
    ]);
  }

  saveSSN() {
    // this.disableSSN = true;
    this.isEditSSN = false;
    this.user.SSN = this.SSN;
    this.ssnControl = new FormControl({value: this.SSN, disabled: true}, [
      Validators.pattern('[0-9]*'),
      Validators.minLength(10)
    ]);
    console.log('user: ', this.user);
    this.authService.updateSingleUserBySSN({table: 'User_Account', key: 'SSN', value: this.SSN}).subscribe((data) => {
      console.log('data: ', data);
      if ( data.success === true ) {
        this.cookieService.set('Id', this.SSN.toString() , 30, '/', '', false);
        this.snackBar.open('Updated successfully!', 'OK', {
          duration: 3000
        });

        this.authService.getSingleUserBySSN().subscribe((data) => {
          console.log('data: ', data);
          if ( data.success === true ) {
            this.user = data.user;
            console.log('user: ', this.user);
          }
        });

      } else {
        this.snackBar.open('Update failed!' , 'OK', {
          duration: 3000
        });
      }
    });
  }

  cancelSSN() {
    // this.disableSSN = true;
    this.isEditSSN = false;
    // this.SSN = this.user.SSN;
    this.ssnControl = new FormControl({value: this.user.SSN, disabled: true}, [
      Validators.pattern('[0-9]*'),
      Validators.minLength(10)
    ]);
  }

  // For Name
  editName() {
    // this.disableSSN = false;
    this.isEditName = true;
    this.nameControl = new FormControl({value: this.user.Name, disabled: false}, [
      Validators.minLength(3)
    ]);
  }

  saveName() {
    // this.disableSSN = true;
    this.isEditName = false;
    this.user.Name = this.Name;
    this.nameControl = new FormControl({value: this.Name, disabled: true}, [
      Validators.minLength(3)
    ]);
    console.log('user: ', this.user);
    this.authService.updateSingleUserBySSN({table: 'User_Account', key: 'Name', value: this.Name}).subscribe((data) => {
      console.log('data: ', data);
      if ( data.success === true ) {
        this.cookieService.set('Name', this.Name, 30, '/', '', false);
        this.snackBar.open('Updated successfully!', 'OK', {
          duration: 3000
        });

        this.authService.getSingleUserBySSN().subscribe((data) => {
          console.log('data: ', data);
          if ( data.success === true ) {
            this.user = data.user;
            console.log('user: ', this.user);
          }
        });

      } else {
        this.snackBar.open('Update failed!' , 'OK', {
          duration: 3000
        });
      }
    });
  }

  cancelName() {
    // this.disableSSN = true;
    this.isEditName = false;
    // this.SSN = this.user.SSN;
    this.nameControl = new FormControl({value: this.user.Name, disabled: true}, [
      Validators.minLength(3)
    ]);
  }

  // For Password
  editPassword() {
    // this.disableSSN = false;
    this.isEditPassword = true;
    this.passwordControl = new FormControl({value: this.user.Password, disabled: false}, [
      Validators.minLength(3)
    ]);
  }

  savePassword() {
    // this.disableSSN = true;
    this.isEditPassword = false;
    this.user.Password = this.Password;
    this.passwordControl = new FormControl({value: this.Password, disabled: true}, [
      Validators.minLength(3)
    ]);
    console.log('user: ', this.user);
    this.authService.updateSingleUserBySSN({table: 'User_Account', key: 'Password', value: this.Password}).subscribe((data) => {
      console.log('data: ', data);
      if ( data.success === true ) {
        this.snackBar.open('Updated successfully!', 'OK', {
          duration: 3000
        });

        this.authService.getSingleUserBySSN().subscribe((data) => {
          console.log('data: ', data);
          if ( data.success === true ) {
            this.user = data.user;
            console.log('user: ', this.user);
          }
        });

      } else {
        this.snackBar.open('Update failed!' , 'OK', {
          duration: 3000
        });
      }
    });
  }

  cancelPassword() {
    // this.disableSSN = true;
    this.isEditPassword = false;
    // this.SSN = this.user.SSN;
    this.passwordControl = new FormControl({value: this.user.Password, disabled: true}, [
      Validators.minLength(3)
    ]);
  }

  // For Phone Number
  editPhoneNo() {
    // this.disableSSN = false;
    this.isEditPhoneNo = true;
    this.phoneControl = new FormControl({value: this.user.PhoneNo, disabled: false}, [
      Validators.minLength(3)
    ]);
  }

  savePhoneNo() {
    // this.disableSSN = true;
    this.isEditPhoneNo = false;
    this.user.PhoneNo = this.PhoneNo;
    this.phoneControl = new FormControl({value: this.PhoneNo, disabled: true}, [
      Validators.minLength(3)
    ]);
    console.log('user: ', this.user);
    this.authService.updateSingleUserBySSN({table: 'Phone', key: 'PhoneNo', value: this.PhoneNo}).subscribe((data) => {
      console.log('data: ', data);
      if ( data.success === true ) {
        this.cookieService.set('MobileNo', this.PhoneNo.toString() , 30, '/', '', false);
        this.snackBar.open('Updated successfully!', 'OK', {
          duration: 3000
        });

        this.authService.getSingleUserBySSN().subscribe((data) => {
          console.log('data: ', data);
          if ( data.success === true ) {
            this.user = data.user;
            console.log('user: ', this.user);
          }
        });

      } else {
        this.snackBar.open('Update failed!' , 'OK', {
          duration: 3000
        });
      }
    });
  }

  cancelPhoneNo() {
    // this.disableSSN = true;
    this.isEditPhoneNo = false;
    // this.SSN = this.user.SSN;
    this.phoneControl = new FormControl({value: this.user.PhoneNo, disabled: true}, [
      Validators.minLength(3)
    ]);
  }
}



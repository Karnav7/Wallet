import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Routes, Router } from '@angular/router';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { User, email } from '../shared/user';

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

  emailInterface: email = {
    id: null,
    EmailAdd: '',
    Verified: 0
  };

  emailIds: email[] = [];

  username: string;
  SSN: number;
  Name: string;
  Password: string;
  PhoneNo: number;
  email: string;
  emailAdd: string;

  disableSSN: boolean = true;
  disableName: boolean = true;
  disablePassword: boolean = true;
  disablePhoneNo: boolean = true;
  disableEmail: boolean = true;

  isEditSSN: boolean = false;
  isEditName: boolean = false;
  isEditPassword: boolean = false;
  isEditPhoneNo: boolean = false;
  isEditEmail: boolean = false;

  showEmailEditPanel: boolean = false;
  emailChecked: boolean = false;
  emailCbDisabled: boolean = true;
  emailCbValue: boolean = false;

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
  ]);
  emailControl = new FormControl({value: this.email, disabled: true}, [
    Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
  ]);
  emailAddControl = new FormControl({value: this.emailAdd}, [
    Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
  ]);
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

        if ( this.user.EmailIds.length > 0 ) {
          this.user.EmailIds.forEach((email) => {
            this.emailIds.push(email);
          });
          console.log('emails: ', this.emailIds);
        }
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

  onEmailIdSelect(emailid: email) {
    console.log('emailid: ', emailid);
    this.emailInterface = emailid;
    this.email = emailid.EmailAdd;
    this.showEmailEditPanel = true;
    console.log('verified: ', this.emailInterface.Verified);
    if ( this.emailInterface.Verified === 1 ) {
      console.log('yo');
      this.emailCbDisabled = true;
      this.emailCbValue = true;
    } else {
      this.emailCbDisabled = false;
      this.emailCbValue = false;
    }
  }

  onClickVerify() {
    if ( this.emailCbValue === true ) {
      console.log('yo');
      // this.emailInterface.Verified = 1;

      this.authService.updateSingleEmailIDByID({table: 'Email', key: 'Verified', id: this.emailInterface.id, value: 1}).subscribe((data: any) => {
        console.log('data', data);
  
        if ( data.success === true ) {
          this.snackBar.open('Email Verified successfully!', 'OK', {
            duration: 3000
          });
  
          this.emailInterface.Verified = 1;
          this.emailCbDisabled = true;
          // this.emailInterface.EmailAdd = this.email.trim();
        }
      });
    }
  }

  editEmail() {
    this.isEditEmail = true;
    this.emailControl = new FormControl({value: this.emailInterface.EmailAdd, disabled: false}, [
      Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    ]);
  }

  deleteEmail() {
    console.log('email selected: ', this.emailInterface.EmailAdd);
    let deleteSnackBar = this.snackBar;
    deleteSnackBar.open('Are you sure?', 'Yes', {
      duration: 5000
    }).onAction().subscribe(() => {
      this.authService.deleteSingleEmailIDByID({table: 'Email', key: 'EmailAdd', id: this.emailInterface.id}).subscribe((data: any) => {

        if ( data.success === true ) {
          for ( let i = 0; i < this.emailIds.length; i++ ) {
            if ( this.emailIds[i].EmailAdd == this.emailInterface.EmailAdd ) {
              this.emailIds.splice(i, 1);
            }
          }
          this.emailInterface = null;
          console.log('emailids: ', this.emailIds);
          this.showEmailEditPanel = false;
  
          this.snackBar.open('Deleted successfully!', 'OK', {
            duration: 3000
          });
        } else {
          this.snackBar.open('Delete operation failed!', 'OK', {
            duration: 3000
          });
        }
      });
    });
  }

  saveEmail() {
    this.isEditEmail = false;
    this.emailIds.forEach((email1) => {
      if ( email1.EmailAdd === this.emailInterface.EmailAdd ) {
        email1.EmailAdd = this.email.trim();
      }
    });
    console.log('updated emailids: ', this.emailIds);
    this.emailControl = new FormControl({value: this.email, disabled: true}, [
      Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    ]);
    
    this.authService.updateSingleEmailIDByID({table: 'Email', key: 'EmailAdd', id: this.emailInterface.id, value: this.email}).subscribe((data: any) => {
      console.log('data', data);

      if ( data.success === true ) {
        this.snackBar.open('Updated successfully!', 'OK', {
          duration: 3000
        });

        this.emailInterface.EmailAdd = this.email.trim();
      }
    });
  }

  saveEmailAdd() {
    this.authService.checkEmail(this.emailAdd.trim(), this.user.SSN).subscribe((data) => {
      console.log('data: ', data);
      if ( data.existing == true ) {
        this.snackBar.open('Email Id is already registered with us, kindly enter new Email Id', 'OK', {
          duration: 3000
        });
      } else {
        let emailAddSnackbar = this.snackBar;
        emailAddSnackbar.open('Click on Verify to verify new EmailId', 'Verify', {
          duration: 5000
        }).onAction().subscribe(() => {
          
          // this.emailIds.push(this.emailInterface);
          this.authService.addNewEmail({SSN: this.user.SSN, EmailAdd: this.emailAdd.trim(), Verified: true}).subscribe((data1) => {
            console.log('data1 ', data1);
            
            if ( data1.success === true ) {
              this.emailInterface.id = data1.id;
              this.emailInterface.EmailAdd = this.emailAdd.trim();
              this.emailInterface.Verified = 1;
              this.emailIds.push(this.emailInterface);
              this.snackBar.open('EmailId added successfully!', 'OK', {
                duration: 3000
              });
            } else {
              this.snackBar.open('Error occured, try again!', 'OK', {
                duration: 3000
              });
            }
          });
        });
      }
    });

    
    
  }

  cancelEmail() {
    this.isEditEmail = false;
    this.emailControl = new FormControl({value: this.emailInterface.EmailAdd, disabled: true}, [
      Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    ]);

  }
}



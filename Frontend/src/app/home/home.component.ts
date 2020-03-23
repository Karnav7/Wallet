import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Routes, Router } from '@angular/router';

import { User } from '../shared/user';

import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.username = this.cookieService.get('Name');
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

}

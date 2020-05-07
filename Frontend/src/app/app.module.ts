import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import {baseDomain, baseURL} from './shared/baseurl';
import { RestangularConfigFactory } from './shared/restConfig';

import { ProcessHttpmsgService } from './services/process-httpmsg.service';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TransactionService } from './services/transaction.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent, SendMoney, RequestMoney } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MonthlyStatementsComponent } from './monthly-statements/monthly-statements.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent, SendMoney, RequestMoney,
    ProfileComponent,
    MonthlyStatementsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MatButtonModule, MatCardModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSnackBarModule,
    MatMenuModule, MatIconModule, MatExpansionModule, MatSelectModule, MatCheckboxModule, MatListModule,
    MatBottomSheetModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    LoadingBarHttpClientModule,
    RestangularModule.forRoot(RestangularConfigFactory),
  ],
  providers: [
    { provide: 'BaseURL', useValue: baseURL },
    ProcessHttpmsgService,
    AuthService,
    CookieService,
    TransactionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

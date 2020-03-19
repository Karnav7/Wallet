import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatSidenavModule,
//   MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatTooltipModule, MatSortModule, MatExpansionModule,
//   MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule, MatSnackBarModule, MatPaginatorModule, MatTabsModule,
//   MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatTableModule, MatAutocompleteModule, MatProgressBarModule,
//   MatChipsModule, MatMenuModule } from '@angular/material';
// import { MatButton} from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    // MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatSidenavModule,
    // MatInputModule, MatRadioModule, MatSelectModule, MatSliderModule, MatTooltipModule, MatSortModule, MatChipsModule,
    // MatSlideToggleModule, MatToolbarModule, MatListModule, MatGridListModule, MatSnackBarModule, MatPaginatorModule,
    // MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatTableModule, MatExpansionModule,
    // MatAutocompleteModule, MatProgressBarModule, MatTabsModule, MatMenuModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    LoadingBarHttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

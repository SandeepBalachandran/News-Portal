import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './views/auth/auth.component';
import { HomeComponent } from './views/home/home.component';
import { ProfileComponent } from './views/profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { specialCharacterValidator } from './views/auth/validator';
import { PaginationComponent } from './views/custom/pagination/pagination.component';
import { HeaderComponent } from './views/header/header.component';
import { ReadlaterComponent } from './views/read-later/read-later.component';



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    ProfileComponent,
    PaginationComponent,
    HeaderComponent,
    ReadlaterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    TabsModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [specialCharacterValidator],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { MessageService } from 'primeng/api';
import { ToastService } from '@app/_services/toast.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { fakeBackendProvider } from './_helpers/fake-backend';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    RippleModule,
    MenubarModule,
    ButtonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider,
    MessageService,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

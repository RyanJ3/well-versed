// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BibleTrackerModule } from './bible-tracker/bible-tracker.module';
import {AuthModule} from 'angular-auth-oidc-client';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,  // Make sure this is added
    BibleTrackerModule,
    AuthModule.forRoot({
      config: {
        authority: 'https://cognito-idp.us-east-1.amazonaws.com/restoftheurl/',
        redirectUrl: 'https://home',
        clientId: 'test8',
        scope: 'email openid phone',
        responseType: 'code'
      },
    }),
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  exports: [AuthModule]
})
export class AppModule { }

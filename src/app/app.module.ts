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
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  exports: [AuthModule]
})
export class AppModule { }

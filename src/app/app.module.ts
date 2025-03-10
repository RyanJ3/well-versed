// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BibleTrackerModule } from './bible-tracker/bible-tracker.module';
import { EsvApiService } from './shared/services/esv-api.service';

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
    EsvApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

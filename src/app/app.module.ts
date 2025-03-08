// src/app/app.module.ts - Updated with HttpClientModule
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {BibleTrackerModule} from './bible-tracker/bible-tracker.module';
import {EsvApiService} from './shared/services/esv-api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BibleTrackerModule
  ],
  providers: [
    EsvApiService // Provide the ESV API service
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

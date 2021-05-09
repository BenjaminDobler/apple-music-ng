import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppleMusic } from './services/apple.music.service';
import { TrackComponent } from './components/track/track.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [AppleMusic],
  bootstrap: [AppComponent]
})
export class AppModule { }

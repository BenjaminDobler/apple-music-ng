import { Component } from '@angular/core';
import { AppleMusic } from './services/apple.music.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(public music: AppleMusic) {
    this.music.init()

  }
}

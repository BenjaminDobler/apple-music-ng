import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AppleMusic } from '../../services/apple.music.service';

@Component({
  selector: 'music-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnInit {
  @Input()
  public track: any;

  @Input()
  public type: 'playlist' | 'song' = 'song';

  @Input()
  public showArtwork = true;

  constructor(public music: AppleMusic) {}

  ngOnInit(): void {}

  @HostListener('click')
  play() {
    if (this.type === 'song') {
      this.music.queue(this.track);
    } else if (this.type === 'playlist') {
      this.music.loadPlaylist(this.track);
    }
  }

  dragStart(event: DragEvent) {
    console.log('drag start ', event);
    event.dataTransfer?.setData('resource', JSON.stringify(this.track));
  }

  dragEnd(event: any) {
    console.log('drag end ', event);

  }

  dragOver(event: any) {
    if (this.type === 'playlist') {
      event.preventDefault();
    }
  }

  drop(event: DragEvent) {
    console.log('drop ', event);
    console.log('drop ', event.dataTransfer?.getData('resource'));
    alert('drop');

  }
}

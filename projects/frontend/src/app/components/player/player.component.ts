import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  currentItem: MusicKit.MediaItem;

  private _player: MusicKit.Player;

  @Input()
  set player(p: MusicKit.Player) {
    this._player = p;
    if (p) {
      p.addEventListener('mediaItemDidChange', (event) => {
        console.log('changed ', event);
        this.currentItem = event.item;
      });
    }
  }

  get player(): MusicKit.Player {
    return this._player;
  }

  constructor() {}

  ngOnInit(): void {
    
  }
}

import { BehaviorSubject } from 'rxjs';
import { api } from '../../environments/secret';

export class AppleMusic {
  playlists: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  libraryAlbums: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  selectedPlaylist: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  selectedLibraryAlbum: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  selectedView: BehaviorSubject<string> = new BehaviorSubject<string>('');



  public musicKit: MusicKit.MusicKitInstance;

  setup: Promise<MusicKit.MusicKitInstance>;

  constructor() {}

  async init() {
    this.setup = new Promise<MusicKit.MusicKitInstance>((resolve) => {
      document.addEventListener('musickitloaded', () => {
        const musicKitInstance: MusicKit.MusicKitInstance = MusicKit.configure({
          developerToken: api.developerToken,
          app: {
            name: 'MusicKit Web App',
            build: '1.0.0',
          },
        });
        console.log('resolve');
        resolve(musicKitInstance);
      });
    });

    this.musicKit = await this.setup;
    console.log('after');

    this.musicKit.addEventListener('playbackProgressDidChange', (e: any) => {
      console.log('playbackProgressDidChange ', e.progress);
    });

    this.musicKit.addEventListener('playbackDurationDidChange', (e: any) => {
      console.log('playbackDurationDidChange ', e);
    });

    this.musicKit.addEventListener('playbackTimeDidChange', (e: any) => {
      console.log('playbackTimeDidChange ', e);
    });

    try {
      await this.musicKit.authorize();
    } catch (error) {
      // Handle cases when authorization fails
      console.log('error ', error);
    }

    this.loadPlaylists();

    this.musicKit.player.addEventListener('mediaItemDidChange', (event)=>{
        console.log('media did change', event);
    });

    const p: any = await this.musicKit.api.recentPlayed();
    console.log(p);

    const p2: any = await this.musicKit.api.library.albums([]);
    console.log(p2);


    const p3: any = await this.musicKit.api.library.artists([]);
    console.log("artists", p3);

  }

  async loadLibraryAlbum(id: string) {
    console.log('id ', id);
    const album = await this.musicKit.api.library.album(id);
    this.selectedLibraryAlbum.next(album);
    this.selectedView.next('library-album');
  }

  async loadLibraryAlbums() {
    const albums: any = await this.musicKit.api.library.albums([]);
    console.log('albums ', albums);
    this.libraryAlbums.next(albums);
    this.selectedView.next('library-albums');

  }

  async loadPlaylists() {
    const playlists = await this.musicKit.api.library.playlists(null);
    this.playlists.next(playlists);

    console.log(playlists);
    this.selectedView.next('playlists');

  }

  async loadPlaylist(p: any) {
      const playlist = await this.musicKit.api.library.playlist(p.id);
      console.log(playlist);
      this.selectedPlaylist.next(playlist);
      this.selectedView.next('playlist');

  }

  searchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  async search(term: string) {
    await this.setup;
    const resource: any = await this.musicKit.api.search(term, {
      limit: 100,
      types: 'songs',
    });

    const songs = resource.songs;

    console.log(songs);

    songs.data = songs.data.map((s: any) => ({
      ...s,
      formattedArtwork: MusicKit.formatArtworkURL(
        s.attributes.artwork,
        100,
        100
      ),
    }));
    this.searchResults.next(songs);
    this.selectedView.next('search-results');

  }

  getAlbums() {}

  queue(song: any) {
    this.musicKit
      .setQueue({
        song: song.id,
      })
      .then(() => {
        this.musicKit.play();
      });
  }

  public formatArtwork(artwork: MusicKit.Artwork, width = 100, height = 100) {
    return MusicKit.formatArtworkURL(artwork, width, height);
  }

  public formatMediaTime(milliseconds: number) {
    return MusicKit.formatMediaTime(milliseconds/1000, '.');
  }
}

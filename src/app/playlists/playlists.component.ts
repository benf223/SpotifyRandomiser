import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    if (localStorage.getItem('access_token')) {
      this.api.getPlaylists().subscribe(res => {
        this.playlists = res.items;
      });
    }
  }

  loggedIn() {
    return !!localStorage.getItem('access_token');
  }

  shuffle(id : string) {
    console.log(id);
    
    let tracks;

    this.playlists.array.forEach(playlist => {
      if (playlist.id === id)
      {
        tracks = playlist.tracks;
      }
    });

    console.log(tracks[1] + tracks[10] + tracks[100]);
    this.shuffleArray(tracks);
    console.log(tracks[1] + tracks[10] + tracks[100]);

    this.api.createPlaylist('__Randomiser__' + id).subscribe((res) => {
      console.log(res);
      
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

  valid(playlist : any) {
    return !playlist.name.includes('__Randomiser__');
  }
}

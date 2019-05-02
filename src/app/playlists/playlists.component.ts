import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  shuffle(id: string) {
    let tracksCount;

    this.playlists.forEach(playlist => {
      if (playlist.id == id) {
        tracksCount = playlist.tracks.total;
      }
    });

    let i = 0;
    this.recurRequest(tracksCount, id, 0, []);

    // console.log(tracks[1] + '' + tracks[10] + '' + tracks[100]);
    // this.shuffleArray(tracks);
    // console.log(tracks[1] + '' + tracks[10] + '' + tracks[100]);

    // this.api.createPlaylist('__Randomiser__' + id).subscribe((res) => {
    //   console.log(res);
    // });
  }

  callback(tracks, id) {
    console.log(tracks[10]);
    console.log(tracks[10].track.id);
    this.shuffleArray(tracks);
    console.log(tracks[10].track.id);

    this.api.getPlaylist('__Randomiser__' + id).pipe(
      catchError((err) => {
        if (err.status === 404) {
          this.api.createPlaylist('__Randomiser__' + id);
        }

        return new Observable();
      })
    ).subscribe((res) => {
      // PUT songs 100 at a time
    });
  }

  recurRequest(tracksCount, id, offset, output) {
    this.api.getTracks(id, offset).subscribe((res) => {
      output = output.concat(res.items);
      if (tracksCount > 100) {
        if (offset <= tracksCount - 100) {
          return this.recurRequest(tracksCount, id, offset + 100, output);
        }
        else {
          this.callback(output, id);
        }
      } else {
        this.callback(output, id);
      }
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  valid(playlist: any) {
    return !playlist.name.includes('__Randomiser__');
  }

  test() {
    //uris=spotify:track:4iV5W9uYEdYUVa79Axb7Rh
    //id 5sKNMuF0yKXqijgbO9dkyO
    this.api.clearPlaylist('5sKNMuF0yKXqijgbO9dkyO').subscribe(res => {
      console.log(res);
    })
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  
  userId;
  userName;
  userImageLink;
  env = environment;

  constructor(private http: HttpClient) { }

  setUserId() {
    this.http.get<any>('https://api.spotify.com/v1/me').subscribe((res) => {
      
      let user = {
        userId: res.id,
        userName: res.display_name,
        userImageLink: res.images[0].url
      }
      
      localStorage.setItem('user', JSON.stringify(user));

      this.userId = res.id;
      this.userName = res.display_name;
      this.userImageLink = res.images[0].url;
    });
  }

  getPlayingSong() {
    this.http.get<any>('https://api.spotify.com/v1/me/player').subscribe((res) => {
      console.log(res);
      console.log(res.item.name);
    });
  }

  getPlaylists() {
    return this.http.get<any>('https://api.spotify.com/v1/me/playlists');
  }

  getPlaylist(id : string) {
    return this.http.get<any>('https://api.spotify.com/v1/me/playlists/' + id);
  }

  getTracks(id: string, offset) {
    let params = new HttpParams().set('offset', offset)
    return this.http.get<any>('https://api.spotify.com/v1/playlists/' + id + '/tracks', {params: params});
  }

  createPlaylist(name : string) {
    return this.http.post('https://api.spotify.com/vl/users/' + this.userId + '/playlists', {
      name: name,
      public: false,
      collaborative: false,
      description: 'Randomised version of ' + name
    });
  }

  addSongToPlaylist(name : string) {

  }
  
  // Add one song then can add more with above
  clearPlaylist(id) {
    return this.http.put('https://api.spotify.com/v1/playlists/' + id + '/tracks', {uris: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh']});
  }

  authenticated() {
    return localStorage.getItem('access_token');
  }
}

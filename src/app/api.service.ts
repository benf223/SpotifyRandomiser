import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      console.log(res);
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

  createPlaylist(name : string) {
    return this.http.post('https://api.spotify.com/vl/users/' + this.userId + '/playlists', {
      name: name,
      public: false,
      collaborative: false,
      description: 'Randomised version of ' + name
    });
  }

  authenticated() {
    return localStorage.getItem('access_token');
  }
}

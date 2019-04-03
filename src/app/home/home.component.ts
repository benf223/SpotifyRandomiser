import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.a) {
        localStorage.setItem('access_token', params.a);
        localStorage.setItem('refresh_token', params.r);
        if (!this.api.userId) {
          this.api.setUserId();
        }
        this.router.navigateByUrl('/playlists');
      }
    });
  }

  onClick() {
    console.log('click');
    this.api.getPlayingSong();
  }

}

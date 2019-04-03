import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public api : ApiService) { }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user'));
      this.api.userId = user.userId;
      this.api.userImageLink = user.userImageLink;
      this.api.userName = user.userName;
    }
  }

  onClick() {
    localStorage.clear();

  }
}

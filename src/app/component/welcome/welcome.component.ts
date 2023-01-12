import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  lastLogin: string;
  userComment: string;

  refresh = new EventEmitter();

  constructor(private login: LoginService, private router: Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('user') == '' || sessionStorage.getItem('user') == null) {
      this.router.navigate(['/info']);
    } else {
      this.lastLogin = sessionStorage.getItem('last_login');
      this.userComment = sessionStorage.getItem('comment');
    }
  }

  public saveLoginAndComment() {
    this.lastLogin = sessionStorage.getItem('current_login');

    this.login.saveLoginAndComment(sessionStorage.getItem('user'), this.lastLogin, this.userComment).subscribe(
      data => {
        this.refresh.emit();
      });

      sessionStorage.setItem('last_login', this.lastLogin);
      sessionStorage.setItem('comment', this.userComment);
}

}


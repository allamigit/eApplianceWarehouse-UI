import { Component, Input, Output, OnInit, EventEmitter, NgModule } from '@angular/core';
import { UserInfo } from 'src/app/model/UserInfo';
import { AccessGroup } from 'src/app/model/AccessGroup';
import { LoginService } from 'src/app/service/login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userLog: UserInfo;
  accessGroup: AccessGroup;
  username: string;
  password: string;
  fullName: string;
  userTitle: string;
  loggedIn: boolean;
  oldPassword: string;
  currentPassword: string;
  validPassword: boolean = true;
  newPassword: string;
  enPassword: boolean = true;
  check1: boolean;
  check2: boolean;
  check3: boolean;
  check4: boolean;
  check5: boolean;
  confirmPassword: string;
  rePassword: boolean;
  matchPassword: boolean = true;
  changeButton: boolean;
  passwordChanged: boolean;
  invalidCredentials: boolean;
  invalidMessage: string;
  lastLogin: string;
  userComment: string;

  refresh = new EventEmitter();

  constructor(private login: LoginService, private router: ActivatedRoute, private router1: Router) { }

  ngOnInit(): void {
    this.accessGroup = new AccessGroup();

    this.getUserPermissions();

    this.router1.navigate(['/info']);
  }

  public logIN() {
    this.invalidCredentials = false;

    this.login.logIN(this.username, this.password).subscribe(
      data => { 
        this.userLog = data;
        this.loggedIn = true;
        this.fullName = data.fullName;
        this.userTitle = data.jobTitle;
        sessionStorage.setItem('user', data.email);
        sessionStorage.setItem('name', data.fullName);
        sessionStorage.setItem('title', data.jobTitle);
        sessionStorage.setItem('uid', data.userId.toString());
        sessionStorage.setItem('last_login', data.loginTimestamp);
        sessionStorage.setItem('current_login', new Date().toString());
        sessionStorage.setItem('comment', data.userComment);
        sessionStorage.setItem('filter', '1');
        sessionStorage.setItem('sfilter', '2');

        this.getUserPermissions();

        this.lastLogin = sessionStorage.getItem('last_login');
        this.userComment = sessionStorage.getItem('comment');   
        this.saveLoginAndComment();

        this.router1.navigate(['/welcome']);

      }, error => {
        if(error.status == 401) {
          this.invalidCredentials = true;
          this.invalidMessage = 'Invalid Password';
        }
        if(error.status == 406) {
          this.invalidCredentials = true;
          this.invalidMessage = 'Invalid Username';
        }
        if(error.status == 423) {
          this.invalidCredentials = true;
          this.invalidMessage = 'Inactive Account';
        }
      });
  }

  public logOUT() {
    this.lastLogin = sessionStorage.getItem('current_login');
    this.userComment = sessionStorage.getItem('comment');   
    this.saveLoginAndComment();

    this.login.logOUT().subscribe(
      data => { 
        this.userLog = data;
        this.loggedIn = false;
        sessionStorage.setItem('user', '');
        sessionStorage.setItem('name', '');
        sessionStorage.setItem('title', '');
        sessionStorage.setItem('uid', '');
        sessionStorage.setItem('login', '');
        sessionStorage.setItem('comment', '');
        sessionStorage.setItem('filter', '');
        sessionStorage.setItem('sfilter', '');
        sessionStorage.setItem('permissions', '');

        location.reload();
      });
  }

  public getUserPermissions() {
    let user = sessionStorage.getItem('user'); 
    this.fullName = sessionStorage.getItem('name');
    this.userTitle = sessionStorage.getItem('title');
    if(user != '' && user != null) {
      this.loggedIn = true;
      this.login.userPermissions().subscribe(
        data => {
          this.accessGroup = data;
          sessionStorage.setItem('permissions', JSON.stringify(this.accessGroup));
        });     
    }
  }

  public getOldPassword() {
    this.login.getOldPassword(sessionStorage.getItem('user')).subscribe(
      data => {
        this.currentPassword = data.toString();

        if(this.oldPassword != null && this.oldPassword == this.currentPassword) this.validPassword = true; else this.validPassword = false;
        this.enPassword = !this.validPassword;  
      });
  }

  public verifyNewPassword() {
    this.check1 = false;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.check5 = false;

    for(let i=0; i<this.newPassword.length; i++) {
      if(this.newPassword[i] >= 'A' && this.newPassword[i] <= 'Z') this.check1 = true;
      if(this.newPassword[i] >= 'a' && this.newPassword[i] <= 'z') this.check2 = true;
      if(this.newPassword[i] >= '0' && this.newPassword[i] <= '9') this.check3 = true;
      if(this.newPassword[i] == '!' || this.newPassword[i] == '@' || this.newPassword[i] == '#' || this.newPassword[i] == '$' || this.newPassword[i] == '%' || this.newPassword[i] == '^' || this.newPassword[i] == '&') this.check4 = true;
    }
    if(this.newPassword.length >= 8) this.check5 = true;
  }

  public enableConfirmNewPassword() {
    if(this.check1 && this.check2 && this.check3 && this.check4 && this.check5) this.rePassword = true; else this.rePassword = false;
  }

  public confirmNewPassword() {
    if(this.confirmPassword.length == this.newPassword.length && this.confirmPassword == this.newPassword) this.changeButton = true; else this.changeButton = false;
    this.matchPassword = this.changeButton;
  }

  public changePassword() {
    this.login.changePassword(sessionStorage.getItem('user'), this.newPassword).subscribe(
      data => {
        this.currentPassword = data.password;
      });

    this.passwordChanged = true;
    this.changeButton = false;
  }

  public resetForm() {
    this.oldPassword = null;
    this.currentPassword = null;
    this.newPassword = null;
    this.confirmPassword = null;
    this.validPassword = true;
    this.enPassword = true;
    this.rePassword = false;
    this.matchPassword = true;
    this.changeButton = false;
    this.passwordChanged = false;
    this.check1 = false;
    this.check2 = false;
    this.check3 = false;
    this.check4 = false;
    this.check5 = false;
  }

  public saveLoginAndComment() {
    this.login.saveLoginAndComment(sessionStorage.getItem('user'), this.lastLogin, this.userComment).subscribe(
      data => {
        this.refresh.emit();
      });

      sessionStorage.setItem('last_login', this.lastLogin);
      sessionStorage.setItem('comment', this.userComment);
  }

}

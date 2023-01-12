import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { UserInfo } from 'src/app/model/UserInfo';
import { AccessGroup } from 'src/app/model/AccessGroup';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://localhost:8080/iWarehouse-api/user/';
  private url = '';

  constructor(private http: HttpClient) { }

  logIN(username: string, password: string): Observable<UserInfo> {
    this.url = this.baseUrl + 'userLogin.iwh:Username=' + username + '&Password=' + password;
    return this.http.get<UserInfo>(this.url);
  }

  logOUT(): Observable<UserInfo> {
    this.url = this.baseUrl + 'userLogout.iwh';
    return this.http.get<UserInfo>(this.url);
  }

  userPermissions(): Observable<AccessGroup> {
    let username = sessionStorage.getItem('user');
    this.url = this.baseUrl + 'getUserPermissions.iwh:Username=' + username;
    return this.http.get<AccessGroup>(this.url);
  }

  getOldPassword(username: string) {
    this.url = this.baseUrl + 'getOldPassword.iwh:Username=' + username;
    return this.http.get(this.url);
  }

  changePassword(username: string, password: string): Observable<User> {
    this.url = this.baseUrl + 'changePassword.iwh:Username=' + username + '&Password=' + password;
    return this.http.put<User>(this.url, password);
  }

  saveLoginAndComment(username: string, loginTimestamp: string, userComment: string): Observable<User> {
    this.url = this.baseUrl + 'saveUserLoginAndComment.iwh:Username=' + username + '&Login=' + loginTimestamp + '&Comment=' + userComment;
    return this.http.put<User>(this.url, username);
  }

}

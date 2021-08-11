import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from "util";
import { UserInterface } from "../models/user-interface";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  private currentUser: UserInterface = {
    first_name: "",
    first_last_name: "",
    second_last_name: "",
    password: "",
    email: ""
  };

  public domainUrl = "https://semindigital.com:8090"
  public testUrl = "http://semindigital.com:8005"

  registerUser(password1: string, password2: string, email: string): Observable<any> {
    const url_api = this.domainUrl + '/rest-auth/registration/';
    return this.http
      .post<UserInterface>(
        url_api,
        {
          "password1": password1,
          "password2": password2,
          "email": email
        }
      )
      .pipe(map(data => data));
  }

  AddNameUser(first_name: string, first_last_name: string, second_last_name: string,) {
    const url_api = this.domainUrl + '/auth/user/';
    var httpHeaders = { 'Authorization': 'Token ' + localStorage.getItem("accessToken") };
    return this.http
      .patch<UserInterface>
      (url_api,
        { first_name, "last_name": first_last_name + " " + second_last_name },
        { headers: httpHeaders },
      ).pipe(map(data => data))
  }

  loginuser(email: string, password: string): Observable<any> {
    console.log(email)
    console.log(password)
    const url_api = this.testUrl + '/rest-auth/login/';
    return this.http
      .post<UserInterface>
      (url_api,
        { email, password },
        { headers: this.headers }
      ).pipe(map(data => data));
  }

  logoutuser() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("data-secondName");
  }

  setEmail(email): void {
    localStorage.setItem("email", email);
  }


  getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem("currentUser");
    if (!isNullOrUndefined(user_string)) {
      let user: UserInterface = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  setPassword(password): void {
    localStorage.setItem("password", password);
  }

  getPassword() {
    return localStorage.getPassword("password");
  }

  setInterface(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

}

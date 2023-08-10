import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";


export interface User{
  name:string;
  username:string;
  email:string;
  password:string;
  role?:string;
  profileImage?:string;
  //confirmPassword:string;
}

export const JWT_NAME = 'blog-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }


  login(email:string, password: string){

    return this.http.post<any>('/api/users/login',{email,password}).pipe(
      map((token)=>{
        console.log("token",token)
        localStorage.setItem(JWT_NAME,token.access_token);
        return token;
      })
    )
  }

  register(user:User){
    return this.http.post<any>('/api/users',user).pipe(
      map(user => user)
    )
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }
}

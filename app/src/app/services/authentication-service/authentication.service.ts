import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";


export interface User{
  id?: number
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

  async getUserId(): Promise<number> {
    const jwt = localStorage.getItem(JWT_NAME);
    
    if (jwt === null) {
      return Promise.reject('JWT not found');
    }
    try {
      const decodedToken: any = this.jwtHelper.decodeToken(jwt);
      if (!decodedToken || !decodedToken.user || !decodedToken.user.id) {
        return Promise.reject('Invalid JWT token');
      }
      return Promise.resolve(decodedToken.user.id);
    } catch (error) {
      return Promise.reject('Error decoding JWT');
    }
  }
}

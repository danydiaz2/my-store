import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroment/enviroment';
import { Auth } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${enviroment.API_URL}/api/auth`

  constructor(private http: HttpClient) { }


  login(email:string, password:string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password}); 
  }

  profile() {
    return this.http.get(`${this.apiUrl}/profile`); 
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
interface AuthResponse {
  status: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8081/api/user/authenticate';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.post<AuthResponse>(this.authUrl, {}, { headers })
      .pipe(
        map((response: AuthResponse) => {
          // Store the token and username in session storage
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('token', response.token);

          return response;
        })
      );
  }

  logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
  }

  isUserLoggedIn(): boolean {
    return sessionStorage.getItem('username') !== null;
  }

  getLoggedInUserName(): string {
    return sessionStorage.getItem('username') || '';
  }
}

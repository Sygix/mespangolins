import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Pangolin } from '../Pangolin';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ApiURL = environment.ApiURL;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient, public jwtHelper: JwtHelperService) { }

  // Register
  register(pangolin: Pangolin): Observable<any> {
    return this.httpClient.post<any>(this.ApiURL + '/register', pangolin)
      .pipe(catchError((err) => {
        this.handleError<any>('Registering a pangolin');
        return throwError(err);
      }));
  }

  // Login
  login(pangolin: Pangolin): Observable<any> {
    return this.httpClient.post<any>(this.ApiURL + '/login', pangolin)
      .pipe(catchError((err) => {
        this.handleError<any>('Logging a pangolin');
        return throwError(err);
      }));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  doLogout(): void {
    localStorage.removeItem('access_token');
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Pangolin } from '../Pangolin';

@Injectable({
  providedIn: 'root'
})
export class PangolinService {
  ApiURL = 'http://localhost:4000/api';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  // Profile
  getMyPangolinProfile(): Observable<any> {
    return this.httpClient.get<any>(this.ApiURL + '/pangolin')
      .pipe(
        catchError(this.handleError<any>('Getting my pangolin profile'))
      );
  }

  // Update Profile
  updateProfile(pangolin: Pangolin): Observable<any> {
    delete pangolin._id;
    return this.httpClient.put<any>(this.ApiURL + '/update-pangolin', pangolin)
      .pipe(
        catchError(this.handleError<any>('Updating my pangolin profile'))
      );
  }

  // Delete Profile
  deleteProfile(): Observable<any> {
    return this.httpClient.delete<any>(this.ApiURL + '/delete-pangolin')
      .pipe(
        catchError(this.handleError<any>('Deleting my pangolin profile'))
      );
  }

  // List Pangolins
  listPangolins(): Observable<any> {
    return this.httpClient.get<any>(this.ApiURL + '/pangolins')
      .pipe(
        catchError(this.handleError<any>('Getting pangolins list'))
      );
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

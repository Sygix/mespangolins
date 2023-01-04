import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of } from 'rxjs';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  ApiURL = environment.ApiURL;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private friendsSubject = new Subject<any>();

  constructor(private httpClient: HttpClient) { }

  // Pangolin friends
  getFriends(): Observable<any>{
    return this.httpClient.get<any>(this.ApiURL + '/friends')
      .pipe(
        catchError(this.handleError<any>('Getting pangolin friends'))
      );
  }

  // add Pangolin friend
  addFriend(id: string): Observable<any>{
    return this.httpClient.post<any>(this.ApiURL + '/friend/request/'+id, {})
      .pipe(
        catchError(this.handleError<any>('Adding pangolin friend'))
      );
  }

  // accept Pangolin friend request
  acceptFriend(id: string): Observable<any>{
    return this.httpClient.post<any>(this.ApiURL + '/friend/accept/'+id, {})
      .pipe(
        catchError(this.handleError<any>('Accepting pangolin friend'))
      );
  }

  // reject Pangolin friend request
  rejectFriend(id: string): Observable<any>{
    return this.httpClient.post<any>(this.ApiURL + '/friend/reject/'+id, {})
      .pipe(
        catchError(this.handleError<any>('Rejecting pangolin friend'))
      );
  }

  // delete Pangolin friend
  delFriend(id: string): Observable<any>{
    return this.httpClient.post<any>(this.ApiURL + '/friend/delete/'+id, {})
      .pipe(
        catchError(this.handleError<any>('Deleting pangolin friend'))
      );
  }

  sendUpdate() {
    this.friendsSubject.next({});
  }

  getUpdate(): Observable<any> {
    return this.friendsSubject.asObservable();
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

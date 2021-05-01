import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  // private API_URL = 'https://jsonplaceholder.typicode.com/postsgg';
  private API_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.API_URL).pipe(catchError(this.handleError));
  }

  handleError(err): any {
    if (err instanceof HttpErrorResponse) {
      // Serverside error
      console.log(err, `------ server`);
    } else {
      // this is client side error
      console.log(err, `------- client`);
    }
    return throwError(err);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, Observable, throwError} from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
// import {  } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class RequestDataService {
  // private baseUrl = 'http://127.0.0.1:8000/api'; // Replace with your API endpoint
  private baseUrl = '/api'; //
  constructor(
    private http: HttpClient,
  ) {}

  get(endpoint: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/${endpoint}`).pipe(
    );
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }
}

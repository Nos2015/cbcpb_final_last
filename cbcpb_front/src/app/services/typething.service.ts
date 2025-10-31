import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { first, catchError, tap, switchMap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Type } from '../models/Type';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TypethingService {
  private url = "http://localhost:3000/typesthing";

  httpOptions: { headers: HttpHeaders } = {
    headers:
      new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      //.append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Origin', 'http://localhost:3000')
  }

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router) { }

  fetchAll(language:string, type:string): Observable<{
      types: any;
      message: String
    }>{
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/typesthing`, {token, language, type}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {types:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {types:"",message:error};
            return of(responseToReturn);
          })
        );
  }
}

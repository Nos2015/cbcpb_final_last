import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, skip, switchMap, tap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { Country } from '../models/Country';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { ResultBackEnd } from '../models/ResultBackEnd';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private url = "http://localhost:3000/country";

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
  
  async fetchAllTemplate():Promise<any>{
    return await this.http.get(this.url)
  }

  fetchAll(lang:string): Observable<{
      countries: any;
      message: String
    }>{
      console.log("url fetch all countries = "+`${this.url}`);
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        countries: any; 
        message: String}>(`${this.url}`, {token, lang}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {countries:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            console.log('There was an error! login ', error);
            var responseToReturn= {countries:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllWithThing(lang:string, idThing:number): Observable<{
      countries: any;
      message: String
    }>{
      console.log("url fetch all countries = "+`${this.url}`);
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        countries: any; 
        message: String}>(`${this.url}`, {token, lang, idThing}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {countries:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            console.log('There was an error! login ', error);
            var responseToReturn= {countries:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  getCountryUser(): Observable<any>{
    return this.http.get<any>(`${this.url}/getcountry`, {headers:{}, responseType: "json"}).pipe(
      catchError(this.errorHandlerService.handleError<any>("getCountryUser",[]))
    );
  }
}

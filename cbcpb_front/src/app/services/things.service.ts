import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { first, catchError, tap, switchMap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Thing } from '../models/Thing';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ThingsService {

  private url = "http://localhost:3000/thing";

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
  
  fetchAllCount(value:string, statut:string, searchThingInList:string, language:string): Observable<{
      thingsCount: any;
      message: String
  }>{
    let token = this.tokenService.getToken();
    let thingsTypeId : number = +value;
    return this.http
    .post<{
      things: any; 
      message: String}>(`${this.url}/thingsallcount`, {token, thingsTypeId, statut, searchThingInList, language}, this.httpOptions)
      .pipe(
        switchMap(
          (response: any) => {
            var responseToReturn = {thingsCount:response,message:"success"};
            return of(responseToReturn);
          }
        ),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          var responseToReturn= {thingsCount:"",message:error};
          return of(responseToReturn);
        })
      );
  }

  fetchAllCountUser(value:string, statut:string, searchThingInList:string, language:string): Observable<{
      thingsCount: any;
      message: String
  }>{
    let token = this.tokenService.getToken();
    let userId = this.userService.getUserId();
    let thingsTypeId : number = +value;
    return this.http
    .post<{
      things: any; 
      message: String}>(`${this.url}/thingsallcountbyuser`, {token, thingsTypeId, statut, userId, searchThingInList, language}, this.httpOptions)
      .pipe(
        switchMap(
          (response: any) => {
            var responseToReturn = {thingsCount:response,message:"success"};
            return of(responseToReturn);
          }
        ),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          var responseToReturn= {thingsCount:"",message:error};
          return of(responseToReturn);
        })
      );
  }

  fetchAll(value:string, language:string, currentPage: number, statut: string, searchThingInList:string): Observable<{
      things: any;
      message: String
    }>{
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/thingsallten`, {token, value, language, currentPage, statut, searchThingInList}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {things:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {things:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllGood(value:string, language:string): Observable<{
      things: any;
      message: String
    }>{
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/thingsallgoodten`, {token, value, language}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {things:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {things:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllNotGoodTen(value:string, language:string): Observable<{
      things: any;
      message: String
    }>{
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/thingsallnotgoodten`, {token, value, language}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {things:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {things:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllEqualTen(value:string, language:string): Observable<{
      things: any;
      message: String
    }>{
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/thingsallequalten`, {token, value, language}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {things:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {things:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllPersonalByPage(value:string, language:string, currentPage: number, statut: string, searchThingInList:string): Observable<{
      things: any;
      message: String
    }>{
    let token = this.tokenService.getToken();
    let userId = this.userService.getUserId();
    return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/thingsallgeneralpersonalbypage`, { token, userId, value, language, currentPage, statut, searchThingInList}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {things:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {things:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllPersonal(value:string, language:string): Observable<{
      things: any;
      message: String
    }>{
    let token = this.tokenService.getToken();
    let userId = this.userService.getUserId();
    return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/thingsallgeneralpersonal`, { token, userId, value, language}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {things:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {things:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllPersonalWithValue(value:string): Observable<{
      things: any;
      message: String
    }>{
    let token = this.tokenService.getToken();
    let userId = this.userService.getUserId();
    let language = localStorage.getItem("language");
    return this.http
      .post<{
        things: any; 
        message: String}>(`${this.url}/thingsallspecificpersonal`, { token, userId, value, language}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {things:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            var responseToReturn= {things:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllPrivate(): Observable<Thing[]>{
    return this.http.get<Thing[]>(`${this.url}/thingsallprivatepersonal`, {responseType: "json", headers:{skip:""}}).pipe(
      catchError(this.errorHandlerService.handleError<Thing[]>("fetchAllPrivate"))
    );
  }

  fetchThingFromId(idThing:number): Observable<{
      things: any;
      message: String
    }>{
    let token = this.tokenService.getToken();
    return this.http
    .post<{
      things: any; 
      message: String}>(`${this.url}/thingwithid`, {token, idThing}, this.httpOptions)
      .pipe(
        switchMap(
          (response: any) => {
            var responseToReturn = {things:response,message:"success"};
            return of(responseToReturn);
          }
        ),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          var responseToReturn= {things:"",message:error};
          return of(responseToReturn);
        })
      );
  }
}

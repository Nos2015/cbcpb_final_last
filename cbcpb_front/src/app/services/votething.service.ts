import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Votething } from '../models/Votething';
import { TokenService } from './token.service';
import { Country } from '../models/Country';

@Injectable({
  providedIn: 'root'
})
export class VotethingService {

  private url = "http://localhost:3000/votes";

  httpOptions: { headers: HttpHeaders } = {
    headers:
      new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      .append('Access-Control-Allow-Origin', 'http://localhost:3000')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Credentials', 'true')
  }

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private tokenService: TokenService) { }

  checkUserVote(idUser:number, idThing:number):Observable<{
      things: any;
      message: String
  }>{
    let token = this.tokenService.getToken();
    return this.http
    .post<{
      things: any; 
      message: String}>(`${this.url}/checkvotes`, {token, idUser, idThing}, this.httpOptions)
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

  addVoteThings(idThing:number, idCountry:number, idContinent:number, cb:number, cpb:number, name:string, nameFr:string):Observable<{
      response:string
  }>{
    let token = this.tokenService.getToken();
    return this.http
    .post<{
      response:string}>(`${this.url}/votethings`, {token, idThing, idCountry, idContinent, cb, cpb, name, nameFr}, this.httpOptions)
      .pipe(
        switchMap(
          (response: any) => {
            return of(response);
          }
        ),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          var responseToReturn= {message:error};
          return of(responseToReturn);
        })
      );
  }

  addVotesUsers(idThing:number, idUser:number):Observable<{
      response:string
  }>{
    let token = this.tokenService.getToken();
    return this.http
    .post<{
      response:string}>(`${this.url}/votesusers`, {token, idUser, idThing}, this.httpOptions)
      .pipe(
        switchMap(
          (response: any) => {
            return of(response);
          }
        ),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          var responseToReturn= {message:error};
          return of(responseToReturn);
        })
      );
  }

  addVoteUpdateThing(idThing:number, cb:number, cpb:number):Observable<{
      response:string
  }>{
    let token = this.tokenService.getToken();
    return this.http
    .post<{
      response:string}>(`${this.url}/updatething`, {token, idThing, cb, cpb}, this.httpOptions)
      .pipe(
        switchMap(
          (response: any) => {
            return of(response);
          }
        ),
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          var responseToReturn= {message:error};
          return of(responseToReturn);
        })
      );
  }
}

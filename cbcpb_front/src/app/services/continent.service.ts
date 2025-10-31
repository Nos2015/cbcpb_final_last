import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { Continent } from '../models/Continent';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContinentService {

  private url = "http://localhost:3000/continent";

  httpOptions: { headers: HttpHeaders } = {
    headers:
      new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      //.append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Origin', 'http://localhost:3000')
  }

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router) { }

  async fetchAllTemplate():Promise<any>{
      return await this.http.get(this.url)
    }
  
  fetchAll(lang:string): Observable<{
      continents: any;
      message: String
    }>{
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        continents: any; 
        message: String}>(`${this.url}`, {token, lang}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {continents:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            console.log('There was an error! login ', error);
            var responseToReturn= {continents:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  fetchAllWithThing(lang:string, idThing:number): Observable<{
      continents: any;
      message: String
    }>{
      let token = this.tokenService.getToken();
      return this.http
      .post<{
        continents: any; 
        message: String}>(`${this.url}`, {token, lang, idThing}, this.httpOptions)
        .pipe(
          switchMap(
            (response: any) => {
              var responseToReturn = {continents:response,message:"success"};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            console.log('There was an error! login ', error);
            var responseToReturn= {continents:"",message:error};
            return of(responseToReturn);
          })
        );
  }

  addNone():Continent{
    const noneContinent: Continent = { id: 0, name: "None", namefr: "Aucun(s)",lowercase_namefr: "aucuns",lowercase_name: "none", image:"../../assets/images_cb_cpb/no_image.png", total_cb:0, total_cpb:0 };
    return noneContinent;
  }
}

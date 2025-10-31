import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, EMPTY, of } from 'rxjs';
import { first, catchError, tap, switchMap } from 'rxjs/operators';
import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private url = "http://localhost:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  isUserAdminIn$ = new BehaviorSubject<boolean>(false);
  isUserUpdate$ = new BehaviorSubject<boolean>(false);
  isUserValidate$ = new BehaviorSubject<boolean>(false);

  userId: Pick<User, "id">;
  userEmail = "";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 
      "Content-Type": "application/json"}),
  }

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService) { }

  getMailUser():string{
    return this.userEmail;
  }

  searchSameUsers(username:string): Observable<any>{
    return this.http.post<any>(`${this.url}/searchsameuser`, {headers:{skip:"false"}, username, responseType: "json"}).pipe(
      //first(),
      catchError(this.errorHandlerService.handleError<any>("searchsameuser"))
    );
  }

  signup(user: Omit<User, "id">): Observable<{statusCode: String; message: String}>{
    this.userEmail = user.email;
    return this.http.post<User>(`${this.url}/signup`, user, this.httpOptions).pipe(
              switchMap(
                (response: any) => {
                  //console.log("response = "+JSON.stringify(response));
                  var responseToReturn = {statusCode:"success",message:response};
                  return of(responseToReturn);
                }
              ),
              catchError((error: any, caught: Observable<any>): Observable<any> => {
                console.log('There was an error!', error);
                var responseToReturn= {statusCode:"error",message:error};
                return of(responseToReturn);
              })
            );
  }

  logout():void{
    this.tokenService.removeToken();
    this.isUserLoggedIn$.next(false);
    this.userService.removeId();
    this.userService.removeEmail();
    this.userService.removeContinent();
    this.userService.removeCountry();
    this.router.navigate(["login"]);
  }

  saveUser():void{
    
  }

  loginSuccess():void{
    //create token
    this.tokenService.setToken("G3zXIBFMmwK3YAsRuT6s2jRumfVfeKlJJm7ZbHGRtVK48SHI5dw4DvIojtC5kkgl");
    this.isUserLoggedIn$.next(true);
    this.router.navigate(["things/mythings"]);
  }

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<{
    token: string;
    userId: Pick<User, "id">;
    email: Pick<User, "email">;
    statusCode: String; 
    message: String
  }>{
    return this.http
      .post<{
        token: string;
        userId: Pick<User, "id">;
        statusCode: String; 
        message: String}>(`${this.url}/login`, { email, password }, this.httpOptions)
       .pipe(
          switchMap(
            (response: any) => {
              //console.log("response login = "+JSON.stringify(response));
              var responseToReturn = {statusCode:"success",message:response.toString()};
              return of(responseToReturn);
            }
          ),
          catchError((error: any, caught: Observable<any>): Observable<any> => {
            console.log('There was an error! login ', error);
            var responseToReturn= {statusCode:"error",message:error};
            return of(responseToReturn);
          })
        );
  }

  changeCodeActivation(
    email: Pick<User, "email">
  ): Observable<{
    token: string;
    userId: Pick<User, "id">;
    statusCode: String; 
    message: String
  }>{
    return this.http
      .post<{
        token: string;
        userId: Pick<User, "id">;
        statusCode: String; 
        message: String}>(`${this.url}/changeCodeActivation`, { email }, this.httpOptions)
       .pipe(
              switchMap(
                (response: any) => {
                  console.log("response changeCodeActivation = "+JSON.stringify(response));
                  var responseToReturn = {statusCode:"success",message:response.toString()};
                  return of(responseToReturn);
                }
              ),
              catchError((error: any, caught: Observable<any>): Observable<any> => {
                console.log('There was an error!', error);
                var responseToReturn= {statusCode:"error",message:error};
                return of(responseToReturn);
              })
            );
  }

  sendCode(
    email: Pick<User, "email">
  ): Observable<{
    token: string;
    userId: Pick<User, "id">;
    statusCode: String; 
    message: String
  }>{
    //console.log("email = "+email);
    //console.log("url = "+`${this.url}/sendmailcode`);
    return this.http
      .post<{
        token: string;
        userId: Pick<User, "id">;
        statusCode: String; 
        message: String}>(`${this.url}/sendmailcode`, { email }, this.httpOptions)
       .pipe(
              switchMap(
                (response: any) => {
                  //console.log("sendmailresponse = "+JSON.stringify(response));
                  var responseToReturn = {statusCode:"success",message:response.toString()};
                  return of(responseToReturn);
                }
              ),
              catchError((error: any, caught: Observable<any>): Observable<any> => {
                console.log('There was an error!', error);
                var responseToReturn= {statusCode:"error",message:error};
                return of(responseToReturn);
              })
            );
  }


  checkuserinfos(token: string, userId: string | null, userEmail: string | null):Observable<{
    email: Pick<User,"email">;
    name: Pick<User,"name">;
  }>{
    /*console.log("checkUserInfos service called check user isLoggedIn");
    console.log("checkUserInfos token = "+token);
    console.log("checkUserInfos userid = "+userId);
    console.log("checkUserInfos userEmail = "+userEmail);*/
    //userId=null;
    if(this.isLoggedIn() && userId != null && userEmail != null){
      //console.log("all elements of checkuserinfos not null");
      return this.http.post<{email: Pick<User,"email">;name: Pick<User,"name">}>(`${this.url}/checkuserinfos`,{token, userId, userEmail}, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: { email: Pick<User,"email">; name: Pick<User,"name">}) => {
          //console.log("save email and name = "+tokenObject.email.toString()+" "+tokenObject.name.toString());
          localStorage.setItem("email",tokenObject.email.toString());
          localStorage.setItem("name",tokenObject.name.toString());
          //console.log("router navigate = "+localStorage.getItem("fromUrl"));
          console.log("GET ITEM FROM URL checkuserinfos auth.service");
          let fromUrl = localStorage.getItem("fromUrl");
          //console.log("fromUrl = "+fromUrl);
          if(fromUrl != "" && fromUrl != null){
            //console.log("try to navigate to "+fromUrl);
            //this.router.navigate([fromUrl]);
            console.log("navigate to = "+fromUrl);
            this.router.navigateByUrl(fromUrl);
          }
          else{
            this.router.navigateByUrl("things/mythings");
            //this.router.navigate(["things/mythings"]);
          }
        }),
        catchError(
          this.errorHandlerService.handleError<{email: Pick<User,"email">;name: Pick<User,"name">;canprivate: Pick<User, "canprivate">;}>("getuserinfos")
        )
      );
    }
    else{
      //console.log("return empty email and name");
      let email = {} as Pick<User,"email">;
      let name = {} as Pick<User,"name">
      return of({email, name});
    }
  }

  update(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ):Observable<{
    token: string;
    response: string;
  }>{
    //console.log("update user called isLoggedIn");
    if (this.isLoggedIn()){
      return this.http
      .post<{token: string;
      response: string}>(`${this.url}/update`, { email, password }, this.httpOptions)
      .pipe(
        //first(),
        tap((tokenObject: { token: string; response: string}) => {
          //console.log("authService => update set item with token = "+tokenObject.token);
          localStorage.setItem("token",tokenObject.token);
          this.isUserUpdate$.next(true);
        }),
        catchError(this.errorHandlerService.handleError<{
          token: string; response: string
        }>("update"))
      );
    }
    else{
      return EMPTY;
    }
  };

  isLoggedIn() {
    console.log("value isLoggedIn with token = "+this.tokenService.getToken());
    return !!this.tokenService.getToken();
  }

  isAdmin(){
    console.log("isAdmin called");
    return !!localStorage.getItem('tokenAdmin');
  }

  checkIsAdmin(
    username: Pick<User, "name">,
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<{
    token: string;
    userId: Pick<User, "id">;
  }>{
    //console.log("checkIsAdmin");
    return this.http
      .post<{token: string;
      userId: Pick<User, "id">;}>(`${this.url}/isadmin`, { username, email, password }, this.httpOptions)
      .pipe(
        //first(),
        tap((tokenObject: { token: string; userId: Pick<User, "id">;}) => {
          this.userId = tokenObject.userId;
          localStorage.setItem("errorMessage","");
          localStorage.setItem("tokenAdmin",tokenObject.token);
          this.isUserAdminIn$.next(true);
          this.router.navigate(["admin"]);
        }),
        catchError(
          this.errorHandlerService.handleError<{token: string; userId: Pick<User, "id">;}>("isadmin")
        )
    );
  }

  validateCode(
    idUser: Pick<User, "id">
    ):Observable<{
      fieldCount: number,
      affectedRows: number,
      insertId: number,
      info: string,
      serverStatus:number,
      warningStatus:number,
      changedRows:number;
    }>{
      return this.http
        .post<{fieldCount: number,
          affectedRows: number,
          insertId: number,
          info: string,
          serverStatus:number,
          warningStatus:number,
          changedRows:number}>(`${this.url}/validateUser`, { idUser }, this.httpOptions)
        .pipe(
          //first(),
          tap((user: { fieldCount: number,
            affectedRows: number,
            insertId: number,
            info: string,
            serverStatus:number,
            warningStatus:number,
            changedRows:number}) => {
            this.isUserValidate$.next(true);
          }),
          catchError(this.errorHandlerService.handleError<{
            fieldCount: number,
            affectedRows: number,
            insertId: number,
            info: string,
            serverStatus:number,
            warningStatus:number,
            changedRows:number
          }>("validateCode"))
      );
  }

  checkCode(
    email:string,
    password:string,
    numCode1: number,
    numCode2: number,
    numCode3: number,
    numCode4: number,
    numCode5: number,

  ):Observable<{
    response:string
  }>{
    return this.http
      .post<{
        response:string}>(`${this.url}/checkcode`, { email, password, numCode1, numCode2, numCode3, numCode4, numCode5 }, this.httpOptions)
       .pipe(
              switchMap(
                (response: any) => {
                  return of(response);
                }
              ),
              catchError((error: any, caught: Observable<any>): Observable<any> => {
                console.log('There was an error!', error);
                var responseToReturn= {statusCode:"error",message:error};
                return of(responseToReturn);
              })
            );
  }

  createThing(
    title: string,
    description: string,
    isPrivate: boolean
  ): Observable<{
    token: string;
    userId: Pick<User, "id">;
  }>{
    return this.http
      .post<{token: string;
      userId: Pick<User, "id">}>(`${this.url}/create-thing`, { title, description, isPrivate }, this.httpOptions)
      .pipe(
        //first(),
        tap((tokenObject: { token: string; userId: Pick<User, "id">;}) => {
          this.userId = tokenObject.userId;
          localStorage.setItem("errorMessage","");
          localStorage.setItem("errorOperationFrom","");
          localStorage.setItem("errorOperationMessageLogin","");
          localStorage.setItem("errorOperationMessage", "");
          //console.log("authService => createThing set item with token = "+tokenObject.token);
          localStorage.setItem("token",tokenObject.token);
          this.isUserLoggedIn$.next(true);
          const fromUrl = localStorage.getItem("fromUrl");
          if (fromUrl != null && fromUrl!= ""){
            this.router.navigate([fromUrl]);
          }
          else{
            this.router.navigate(["profil"]);
          }
        }),
        catchError(
          this.errorHandlerService.handleError<{token: string; userId: Pick<User, "id">}>("create-thing")
        )
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(
    private tokenService:TokenService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();
    //console.log("intercept token ="+token);
    if (token){
      const clonedRequest  = req.clone({
        headers: req.headers.set("Authorization", "Bearer "+token)
      })
      return next.handle(clonedRequest);
    }
    else{
      return next.handle(req);
    }
  }
}

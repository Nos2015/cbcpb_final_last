import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable <boolean> {
      //console.log("AuthGuardService canActivate isLoggedIn");
      if (!this.authService.isLoggedIn()){
        this.router.navigate(["signup"]);
      }
      else{
        this.authService.isUserLoggedIn$.next(true);
      }
      return this.authService.isUserLoggedIn$;
  }
}

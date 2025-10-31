import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';
import { ThingsService } from 'src/app/services/things.service';
import { EMPTY, isEmpty, Observable, Subject } from 'rxjs';
import { Thing } from '../models/Thing';
import { FormGroup } from '@angular/forms';
import { MessageComponent } from '../message/message.component';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private localStorageService: LocalstorageService,
              private sessionStorageService: TokenService,
              private authService: AuthService,
              private thingService: ThingsService,
              private router: Router,
              private userService: UserService) { }


  setColorMessageComponent(color:string, messageComponent:MessageComponent){
    if (messageComponent!=undefined){
      messageComponent.setColorMessage(color);
    }
  }

  setMessageErrorComponent(message:string, messageComponent:MessageComponent){
    if (messageComponent!=undefined){
      messageComponent.setMessage(message);
      if (message != ""){
        this.localStorageService.setLocalStorage("errorMessage","");
      }
    }
  }

  fetchAllPrivate(): Observable<Thing[]>{
    return this.thingService.fetchAllPrivate();
  }

  checkError(pageSet:string, messageComponent:MessageComponent | null, form:FormGroup<any>|null, arrayElements:Array<any>|null, messageError:string|null): Observable<boolean>{
    /**Get a token when user is logged in */
    const token = this.sessionStorageService.getToken();

    /**Get the page when we check error */
    const fromUrl = this.localStorageService.getLocalStorage("fromUrl");

    /**Set default red error color to the messageComponent on the page fromUrl*/
    if (messageComponent != null){
      this.setColorMessageComponent("red", messageComponent);
    }

    /**Get the error or success message */
    var errorOperation  : any;
    if (fromUrl === "validUser"){
      /**Get the success message */
      errorOperation = this.localStorageService.getLocalStorage("successOperationMessage")!;
    }
    else{
      /**Get the error message */
      errorOperation = this.localStorageService.getLocalStorage("errorOperationMessage")!;
    }

    /**Initialize the object to return */
    var subject = new Subject<boolean>();

    /**Check if user is logged in or not */
    if(this.authService.isLoggedIn() && token!=null){
      /**User is logged in */
      if (pageSet === "login"){
        /**If the page where user try to go is login page, the user can't see it */
        var routerTo = "";
        /**Check the page where user try to go the login page */
        /**Define the page where user need to return */
        if (fromUrl==="profil"){
          routerTo = "profil";
        }
        else if (fromUrl==="create-things"){
          routerTo = "create-things";
        }
        else if (fromUrl==="things/mythings"){
          routerTo = "things/mythings";
        }

        /**Define the errorMessage with the pageSet because we checked the errror page on all pages
         * With the pageSet we will show the error message because user can't go to the page he wanted
         */
        localStorage.setItem("errorMessage",pageSet);
        /**Go to the previous page */
        //console.log("route to = "+routerTo);
        this.router.navigate([routerTo]);
        /**Return the check error */
        subject.next(false);
        return subject.asObservable();
      }
      else{
        console.log("CHECKERROR user logged in");
        /**Check the error when the user is logged in */
        /**The user may no longer have access to the database*/
        /**This means we have to disconnect it */
        /**We save the page when user refresh it but he normally can't access it like profile page */
        //console.log("errorService user logged in and token not null and pageSet not logged in");
        //console.log("errorService pageSet = "+pageSet);
        //console.log("errorService token  = "+token);
        //console.log("errorService usrerId  = "+this.userService.getUserId());
        //console.log("errorService userEmail  = "+this.userService.getUserEmail());
        //this.localStorageService.setLocalStorage("fromUrl",pageSet);
        /**We try to access user infos on the back-end */
        this.authService.checkuserinfos(token, this.userService.getUserId(), this.userService.getUserEmail()).subscribe(element =>{
          //console.log("checkuserinfos return email = "+element.email);
          //console.log("checkUserInfos return name = "+element.name);
          if (element == undefined){
            console.log("CHECK USER INFOS NOT GOOD");
            this.localStorageService.setLocalStorage("errorMessage", pageSet);
            this.authService.logout();
            subject.next(false);
          }
          else{
            console.log("CHECK USER INFOS OK");
            if (errorOperation!=="" && errorOperation!=null){
              if (messageComponent != null){
                this.setMessageErrorComponent(errorOperation, messageComponent);
              }
              this.localStorageService.setLocalStorage("errorOperationFrom","");
              this.localStorageService.setLocalStorage("errorOperationMessage","");
            }
            else{
              if (messageComponent != null && messageError!=null){
                this.setMessageErrorComponent(messageError,messageComponent);
              }
            }
            if(pageSet === "create-things"){
              if(arrayElements!=null){
                //arrayElements[0] = Number(element.canprivate)!=0 ? false:true;
                var linkToPrivate = document.getElementById('needPrivate')!;
                linkToPrivate.style.display = arrayElements[0]==false?'none':'show';
                this.router.navigate(["/create-things"]);
              }
            }
            else if (pageSet === "profil"){
              this.router.navigate(["/profil"]);
              var email_recup = element.email!=undefined ? element.email:"";
              var name_recup = element.name!=undefined ? element.name:"";

              if (form != null){
                form.setValue({
                  name:name_recup,
                  email:email_recup
                });
              }
            }
            else if (pageSet == "things/mythings"){
              this.router.navigate(["/things/mythings"]);
            }
            else if (pageSet == ""){
              this.router.navigate(["/"]);
            }
            subject.next(true);
          }     
        })
        return subject.asObservable();
      }
    }
    else{
      /**The user isn't logged in */
      if (pageSet === "login"){
        /**User try to access a page from login page or we display a success message like when he create an account with success*/
        if (fromUrl != null && fromUrl != ""){
          if(fromUrl === "validUser"){
            /**We display a success message on the login page when user create an account with success */
            messageError = errorOperation;
            /**We changed the color of messageComponent with green color for a success message */
            if(messageComponent != null){
              this.setColorMessageComponent("green", messageComponent);
            }
            /**We reinitialize the success message */
            localStorage.setItem("successOperationMessage","");
            /**We remove the page like signup page where we initialized success message to display on login page*/
            this.localStorageService.setLocalStorage("fromUrl","");
          }
          /**Remove error messages if we refresh login page. When it is refreshed we go to 2 below*/
          //localStorage.setItem("errorOperationMessage","");
          localStorage.setItem("errorOperationFrom","");
        }

        if (messageError != "" && messageError!=null){
          /**We display if user use a wrong email
           * or password
           * or if user need to validate his account
           * or display a success message on login page*/
          if (messageComponent!=null){
            this.setMessageErrorComponent(messageError,messageComponent);
          }
          subject.next(true);
        }
        else{
          /**Nothing to display like refresh login page when he's already on it */
          subject.next(false);
        }

        return subject.asObservable();
      }
      else if (pageSet === "things/detailthing"){
        subject.next(false);
        return subject.asObservable();
      }
      else{
        /**2 - User try to access a page he can't because not logged in from another page*/
        this.localStorageService.setLocalStorage("errorMessage", pageSet);
        this.router.navigate(["login"]);
        subject.next(false);
        return subject.asObservable();
      }
    }
  }
}

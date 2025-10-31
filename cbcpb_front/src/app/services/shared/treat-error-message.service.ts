import { Injectable } from '@angular/core';
import { TranslateappService } from '../translateapp.service';

@Injectable({
  providedIn: 'root'
})
export class TreatErrorMessageService {

  constructor() { 
  }

  treatErrorSignup(error:string, currentLang:string):string{
    switch(error){
      case "Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: users.name":{
        if (currentLang == "en"){
          return "This username already exist. That's not good."
        }
        else{
          return "Ce nom d'utilisateur existe déjà. C'est pas bien."
        }
      }
      case "Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email":{
        if (currentLang == "en"){
          return "This email already exist. That's not good."
        }
        else{
          return "Cet email existe déjà. C'est pas bien"
        }
      }
      default:
        return ""
    }
  }

  treatFromComponent(action:string, error:string, currentLang:string):string{
    if(action == "signup"){
      return this.treatErrorSignup(error, currentLang);
    }
    else{
      return "";
    }
  }
}

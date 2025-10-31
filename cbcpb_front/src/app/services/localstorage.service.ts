import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setLocalStorage(key: string, value:string){
    localStorage.setItem(key, value);
  }

  getLocalStorage(key: string){
    return localStorage.getItem(key);
  }

  getLanguageApplication():string{
    let language = this.getLocalStorage("language");
    if (language == null){
      language = "fr";
    }
    return language;
  }
}

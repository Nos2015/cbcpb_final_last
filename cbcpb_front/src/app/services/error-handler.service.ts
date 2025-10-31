import { Injectable} from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {

  constructor(private localStorageService: LocalstorageService) { }

  handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      /*console.log("errorOperationFrom = "+operation);
      console.log("error = "+JSON.stringify(error));
      console.log("error length = "+error.length);
      console.log("error error = "+error.error);*/
      this.localStorageService.setLocalStorage("errorOperationFrom", operation);
      if(error.error != undefined){
        this.localStorageService.setLocalStorage("errorOperationMessage", error.error.error.message);
      }
      return of(result as T);
    }
  }
}

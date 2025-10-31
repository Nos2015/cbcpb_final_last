import { Component } from '@angular/core';

@Component({
    selector: 'app-errormessage',
    templateUrl: './errormessage.component.html',
    styleUrls: ['./errormessage.component.scss'],
    standalone: false
})
export class ErrormessageComponent {
  errorMessageText:string | null = "";

  setErrorMessage(message:string){
    this.errorMessageText = message;
    if (localStorage.getItem("errorMessage") === "login"){
      var element = document.getElementById('errorBox');
      if (element) element.className = element.className+" errorStyleProfil";
    }
  }

  getErrorMessage():string|null{
    return this.errorMessageText;
  }
}

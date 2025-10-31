import { Component } from '@angular/core';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    standalone: false
})
export class MessageComponent {
  messageText:string | null = "";
  /**default error message */
  color:string = "red";
  /** Type localStorage to set */
  messageLocalStorage = "";

  setMessage(message:string){
    this.messageText = message;
    if (localStorage.getItem("errorMessage") === "login"){
      var element = document.getElementById('messageBox');
      if (element) element.className = element.className+" messagePadding";
    }
  }

  setColorMessage(color:string){
    this.color = color;
  }

  setMessageLocalStorage(type:string, value:string){
    localStorage.setItem(type, value);
  }

  getMessage():string|null{
    return this.messageText;
  }
}

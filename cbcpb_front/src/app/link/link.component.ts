import { Component } from '@angular/core';

@Component({
    selector: 'app-link',
    templateUrl: './link.component.html',
    styleUrls: ['./link.component.scss'],
    standalone: false
})
export class LinkComponent {
  url = "";
  elementsSend : any;
  textLink = "";
  displayLink = false;
  color = "";
  paddingTop = "0px";

  setColor(color: string){
    this.color = color;
  }

  setPaddingTop(padding:string){
    this.paddingTop = padding;
  }

  setDisplayLink(display:boolean){
    this.displayLink = display;
  }

  getDisplayLink():boolean{
    return this.displayLink;
  }

  setTextLink(text:string){
    this.textLink = text;
  }

  getTextLink():string{
    return this.textLink;
  }

  setUrl(url:string){
    this.url = url;
  }

  getUrl():string{
    return this.url;
  }

  addElementSend(element:any){
    this.elementsSend = element;
  }

  getLingArray():any[]{
    return this.elementsSend;
  }
}

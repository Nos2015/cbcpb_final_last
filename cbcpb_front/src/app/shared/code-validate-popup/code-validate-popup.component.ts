import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-code-validate-popup',
    templateUrl: './code-validate-popup.component.html',
    styleUrls: ['./code-validate-popup.component.scss'],
    standalone: false
})

export class CodeValidatePopupComponent {
  @Output() tryCode = new EventEmitter<any>();
  isPopupVisible = false;

  showPopup() {
    this.isPopupVisible = true;
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
  
  hidePopup() {
    this.isPopupVisible = false;
  }

  closePopup() {
	  this.hidePopup();
    this.tryCode.emit();
  }

}

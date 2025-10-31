import {Component, Inject, OnInit, ElementRef} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {CommonModule, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TranslateappService } from '../services/translateapp.service';

export interface DialogData {
  title: string;
  subText: string;
  value: string;
  proposition: string;
}

@Component({
    selector: 'app-popup-window',
    templateUrl: './popup-window.component.html',
    styleUrls: ['./popup-window.component.scss'],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        NgIf,
        MatDialogModule,
        CommonModule,
    ],
    standalone: true
})
export class PopupWindowComponent implements OnInit{

  cancel:string= "";
  updateLanguageFirst = true;

  constructor(
    public dialogRef: MatDialogRef<PopupWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translate: TranslateappService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void{
    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
      }
    );
    this.changeLanguage();
  }

  updateLanguage(){
    this.translate.translate.get(
      [
        'proposition.nothanks',
      ]
    )
    .subscribe(translations => {
      this.cancel = translations['proposition.nothanks'];
    });
  }

  changeLanguage(){
    this.translate.translate.onLangChange.subscribe(()=> {
      //changeLanguage when page is on front
      if(this.elementRef.nativeElement.offsetParent != null) {
        this.updateLanguageFirst = false;
        this.updateLanguage();
      }
    });
    //changeLanguage when page is on front
    if(this.elementRef.nativeElement.offsetParent != null) {
      if(this.updateLanguageFirst){
        this.updateLanguage();
      }
    }
  }

  setTitle(title:string){
    this.data.title = title;
  }

  setSubText(subText:string){
    this.data.subText  = subText;
  }

  setValue(value:string){
    this.data.value = value;
  }

  setProposition(proposition: string){
    this.data.proposition = proposition;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

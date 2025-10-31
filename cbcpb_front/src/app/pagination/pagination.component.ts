import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateappService } from '../services/translateapp.service';

@Component({
  selector: 'app-pagination',
  //imports: [BrowserAnimationsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  standalone: false,
})
export class PaginationComponent {
  @Input() totalItems:any;
  @Input() currentPage:any;
  @Input() itemsPerPage:any;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  pages : number[] = [];
  previous = "";
  next = "";
  
  constructor(
    private elementRef: ElementRef,
    public translate: TranslateappService
    ){
  }


  ngOnInit(): void{
    //this.setTotalItems(this.totalItems)
    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
      }
    );
    this.changeLanguage();
  }

  changeLanguage(){
    if(this.elementRef.nativeElement.offsetParent != null) {
      this.translate.translate.get(
        [
          "previous",
          "next"
        ]
      )
      .subscribe(translations => {
         this.previous = translations['previous'];
        this.next = translations['next'];
      });
    }
  }

  setTotalItems(total:number): void{
    //console.log("totalItems to see = "+total);
    console.log("YOUHOU setTotalItems = "+total);
    if(total!=null && total != undefined){
      console.log("total = "+total);
      //console.log("totalItems per page = "+this.itemsPerPage);
      this.totalItems = Math.ceil(total/this.itemsPerPage);
      //console.log("totalItems = "+this.totalItems);
      this.pages = Array.from({ length : this.totalItems}, (_, i)=>i+1);
    }
  }

  pageClicked(page:number){
    //console.log("pageClicked = "+page);
    //console.log("totalItems = "+this.totalItems);
    //if(page>this.totalItems) return;
    //console.log("onClick emit");
    this.onClick.emit(page);
  }
}

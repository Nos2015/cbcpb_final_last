import { Component, ViewEncapsulation, ElementRef, OnInit, NgModule } from '@angular/core';
import { TranslateappService } from '../services/translateapp.service';
import { ErrorService } from '../services/error.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  template: '<div class="cta-text" [innerHTML]="homeText"></div>',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})

export class HomeComponent implements OnInit{
  createText = "";
  voteText = "";
  orText = "";
  withcbcpbText = "";
  introductionText ="";
  goodPath:"";
  notgoodPath:"";
  hasCheckError:boolean = false;
  createButton:"";
  voteButton:"";
  intro:"";
  arrayOfCbCpb =[
    {
      id:0,
      src:"../../assets/images_cb_cpb/citron1.png",
      cb:10100,
      cpb:453
    },
    {
      id:1,
      src:"../../assets/images_cb_cpb/gorille.png",
      cb:101,
      cpb:4530
    },
    {
      id:2,
      src:"../../assets/images_cb_cpb/poire1.png",
      cb:2200,
      cpb:45
    },
    {
      id:3,
      src:"../../assets/images_cb_cpb/chien.png",
      cb:2103,
      cpb:25
    }
  ];

  constructor(public translate: TranslateappService,
              private elementRef: ElementRef,
              private errorService: ErrorService,
              private authService: AuthService
  ){}

  ngOnInit(): void{
    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
      }
    );
    this.changeLanguage();
  }

  checkError():void{
    //console.log("checkError from homeComponent");
    this.errorService.checkError("", null, null, null, null).subscribe(
      (actionNeeds)=>
        {
          this.hasCheckError = true;
        }
    );
  }

  changeLanguage(){
    //changeLanguage when page is on front
    if(this.elementRef.nativeElement.offsetParent != null) {
      this.translate.translate.get(
        [
          'home.text',
          'home.create',
          'home.vote',
          'home.intro',
          "images.buttonGood",
          "images.buttonNotGood",
          "orText",
        ]
      )
      .subscribe(translations => {
        //console.log("changeLanguage HomeComponent");
        this.goodPath = translations['images.buttonGood'];
        this.notgoodPath = translations['images.buttonNotGood'];
        this.createButton = translations['home.create'];
        this.voteButton = translations['home.vote'];
        this.intro = translations['home.intro'];
        this.orText = translations['orText'];
        if (!this.hasCheckError && this.authService.isLoggedIn()){
          this.checkError();
        }
      });
    }
  }
}

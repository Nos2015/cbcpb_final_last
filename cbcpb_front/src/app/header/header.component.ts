import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateappService } from '../services/translateapp.service';
import { TokenService } from '../services/token.service';
import { MythingsComponent } from '../things/mythings/mythings.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false,
    providers:[MythingsComponent]
})
export class HeaderComponent implements OnInit{
  @Input()sidebarActive = false;
  @Output()toggleSidebar = new EventEmitter();
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @Input() dataList:any;

  searchLabel = "";
  languageSelect = "";
  loginText = "";
  logoutText = "";
  frenchText = "";
  englishText = "";
  isAuthenticated = false;
  openButton = false;

  constructor(private authService: AuthService, 
              private router : Router, 
              private renderer : Renderer2, 
              public translate: TranslateappService,
              private sessionService: TokenService,
              private mythingComponent: MythingsComponent){
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement){
          this.openButton=false;
      }
    });
    const language = localStorage.getItem("language");
    if (!language || language=="fr"){
      localStorage.setItem("language","fr");
      this.changeLanguage();
    }
    else{
      localStorage.setItem("language","en");
      this.changeLanguage();
    }
  }

  changeLanguage():void{
    this.translate.translate.get(
      [
        "language",
        "header.research",
        'header.selectLanguage',
        "login",
        "logout",
        "header.french",
        "header.english"
      ]
    )
    .subscribe(translations => {
      this.searchLabel = translations['header.research'];
      this.languageSelect = translations['header.selectLanguage'];
      this.loginText = translations['login'];
      this.logoutText = translations['logout'];
      this.frenchText = translations['header.french'];
      this.englishText = translations['header.english'];
      console.log("header name route = "+this.router.url);
    });
  }

  ngOnInit(): void {
      this.authService.isUserLoggedIn$.subscribe(() => {
        console.log("header component isLoggedIn");
          this.isAuthenticated = this.authService.isLoggedIn();
      });
  }

  logout():void{
    console.log("logout called");
    this.sessionService.removeToken();
    localStorage.removeItem("token");
    this.authService.isUserLoggedIn$.next(false);
    this.router.navigate(["login"]);
  }

  toggleLanguage(language: string):void{
    if (localStorage.getItem("language") != language){
      localStorage.setItem("language", language);
      this.translate.setTransLanguage(language);
      this.changeLanguage();
    }
  }

  openOrCloseButton():void{
    this.openButton = !this.openButton;
  }

  goToCreate():void{
    this.router.navigate(["create-things"]);
  }
}

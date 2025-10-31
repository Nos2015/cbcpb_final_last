import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateappService } from 'src/app/services/translateapp.service';
import { LocalstorageService } from '../services/localstorage.service';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
    standalone: false
})
export class SideBarComponent implements OnInit{
  constructor(private authService: AuthService,
              private router : Router,
              public translate: TranslateappService,
              public localStorage: LocalstorageService){
  }

  isAuthenticated = false;

  homeText = "";
  listAllThingsText = "";
  allThingsText = "";
  allGoodThingsText = "";
  allNotGoodThingsText = "";
  allIdenticalThingsText = "";
  createThingsText = "";
  loginText = "";
  logoutText = "";
  signupText = "";
  myThingsText = "";
  myProfileText = "";

  url = "/things/allthings";
  
  @Output()toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
      this.authService.isUserLoggedIn$.subscribe(() => {
          this.isAuthenticated = this.authService.isLoggedIn();
      })
      this.translate.comp$.subscribe(
        () => {
            this.changeLanguage();
        }
      );
      this.changeLanguage();
  }

  logout():void{
    localStorage.removeItem("token");
    this.authService.isUserLoggedIn$.next(false);
    this.goTo("login",'');
  }

  goTo(url: string, status: string): void{
    window.scroll(0,0);
    console.log("sidebar status = "+status);
    this.localStorage.setLocalStorage("fromUrl","");
    if(((url == "/things/allthings" || url =="/things")  && status == "") 
      || (url == "/things/allthings" && status == "cb>cpb") 
      || (url == "/things/allthings" && status == "cb<cpb")
      || (url == "/things/allthings" && status == "cb==cpb")){
      this.localStorage.setLocalStorage("thingStatut",status);
    }
    this.router.navigateByUrl(url);
    if(this.router.url == url){
      window.location.reload();
    }
    /*if(status == ""){
      this.router.navigateByUrl(url);
    }
    else{
      this.router.navigate(['things/allthings/detailthing'],
      {
        state: {
          from: from,
          url: url
        }
      }
      );
    }*/
    //
    
    this.toggleSidebar.emit(false);
  }

  changeLanguage(){
    this.translate.translate.get(
      [
        "sidebar.home",
        "sidebar.listallthings",
        "sidebar.allthings",
        "sidebar.justgood",
        "sidebar.justnotgood",
        "sidebar.justidentical",
        "sidebar.createthings",
        "login",
        "logout",
        "createAccount",
        "user.myAllThings",
        "user.myProfileText"
      ]
    )
    .subscribe(translations => {
      this.homeText = translations['sidebar.home'];
      this.listAllThingsText = translations['sidebar.listallthings'];
      this.allThingsText = translations['sidebar.allthings'];
      this.allGoodThingsText = translations['sidebar.justgood'];
      this.allNotGoodThingsText = translations['sidebar.justnotgood'];
      this.allIdenticalThingsText = translations['sidebar.justidentical'];
      this.createThingsText = translations['sidebar.createthings'];
      this.loginText = translations['login'];
      this.logoutText = translations['logout'];
      this.signupText = translations['createAccount'];
      this.myThingsText = translations['user.myAllThings'];
      this.myProfileText = translations['user.myProfileText'];
    });
  }
}

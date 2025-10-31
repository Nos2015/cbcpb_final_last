import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateappService } from '../../services/translateapp.service';
import { Observable, of } from 'rxjs';
import { Thing } from 'src/app/models/Thing';
import { ThingsService } from 'src/app/services/things.service';
import { MessageComponent } from 'src/app/message/message.component';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: false
})
export class UserComponent implements OnInit, AfterContentChecked{
  userForm!: FormGroup;

  myProfileText  = "";
  usernameText = "";
  emailText = "";
  add = "";
  passwordText = "";
  placeHolderUsernameText = "";
  placeHolderEmailText = "";
  placeHolderPasswordText = "";

  textTitle = "";
  textStatus ="";
  textNothingPersonalThings = "";
  textNothingPersonalPrivateThings = "";

  updateText="";

  searchThingInList = "";
  userThings: Array<Thing>= [];
  thingsPersonal: Observable<Thing[]>;
  thingsPrivate: Observable<Thing[]>;

  thingsReturnedPersonal: Observable<{
      things: any;
      message: String
  }>

  thingsReturnedPrivate: Observable<{
      things: any;
      message: String
  }>

  myThingsText = "";
  textSeeAllPersonalGeneralThings = "";
  myPrivateThingsText = "";
  textSeeAllPersonalPrivateThings = "";
  messageError = "";

  //errors possible
  errorEmailLogin = "";
  errorPasswordLogin = "";

  hasCheckError:boolean = false;

  listAllThingsText = "";
  listAllGoodThingsText = "";
  listAllNotGoodThingsText = "";
  listAllIdenticalThingsText = "";

  @ViewChild(MessageComponent) messageComponent: any;
  @ViewChildren('MessageComponent')
  public messageComponents: QueryList<MessageComponent>;

  constructor(private authService: AuthService,
              private router: Router,
              public translate: TranslateappService,
              private thingService: ThingsService,
              private changeDetector: ChangeDetectorRef,
              private localStorageService: LocalstorageService,
              private errorService: ErrorService,
              private elementRef: ElementRef
            ){

  }

  ngOnInit(): void{
    this.userForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup{
    return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email])
    })
  }

  updateMyThings(value:string, language:string):void{
      of(this.thingService.fetchAllPersonal(value, language)).subscribe({
          next: (v) => v.subscribe(
          {
            next:(v) => {
              if(v.message == "success" && v.things.length>0){
                let things = v.things as Array<any>;
                for (let i = 0; i < things.length; i++) {
                    let thing = things[i] as Thing;
                    if(thing.image == null){
                      thing.image = "../../assets/images_cb_cpb/no_image_notround.png";
                    }
                    this.userThings.push(thing);
                }
              }
              this.thingsPersonal = of(this.userThings);
            },
            error: (e) => console.error(e),
            complete: () => {
              console.info('complete changeCodeActivation 150');
            }
          }
        ),
        error: (e) => console.error(e),
        complete: () => {
          console.info('complete changeCodeActivation 156');
        }
        }
      )
    }
  
    getAllThingsUser():void {
      this.userThings = [];
      let language = this.localStorageService.getLanguageApplication();
      //change code activation
      this.updateMyThings(this.searchThingInList, language);
    }

  fetchAllPersonal(): Observable<{
      things: any;
      message: String
    }>{
    return this.thingService.fetchAllPersonal("", "fr");
  }

  executeListing(value: string) {
    this.searchThingInList = value;
    this.userThings = [];
    let language = this.localStorageService.getLanguageApplication();
    this.updateMyThings(value, language);
  }

  fetchAllPrivate(): Observable<Thing[]>{
    return this.thingService.fetchAllPrivate();
  }

  changeLanguage(){
    if(this.elementRef.nativeElement.offsetParent != null) {
      this.translate.translate.get(
        [
          'username',
          'email',
          "password",
          "login",
          "notwell",
          "gooduser",
          "goodemail",
          "goodpassword",
          "update",
          "add",
          "user.myProfileText",
          "things.myThingsText",
          "things.myPrivateThingsText",
          "things.textSeeAllPersonalGeneralThings",
          "things.textSeeAllPersonalPrivateThings",
          "things.textTitle",
          "things.textStatus",
          "things.textNothingPersonalThings",
          "things.textNothingPersonalPrivateThings",
          "user.myProfileText",
          "errorMessageAccessLoginFromProfil",
          "errors.userNotFound",
          "errors.password",
          "things.listallthings",
          "things.listgoodthings",
          "things.listnotgoodthings",
          "things.listidenticalthings"
        ]
      )
      .subscribe(translations => {
        this.listAllThingsText = translations['things.listallthings'];
        this.listAllGoodThingsText = translations['things.listgoodthings'];
        this.listAllNotGoodThingsText = translations['things.listnotgoodthings'];
        this.listAllIdenticalThingsText = translations['things.listidenticalthings'];
        this.usernameText = translations['username'];
        this.emailText = translations['email'];
        this.passwordText = translations['password'];
        this.placeHolderUsernameText = translations['gooduser'];
        this.placeHolderEmailText = translations['goodemail'];
        this.placeHolderPasswordText = translations['goodpassword'];
        this.updateText = translations['update'];
        this.myThingsText = translations["things.myThingsText"];
        this.textSeeAllPersonalGeneralThings = translations["things.textSeeAllPersonalGeneralThings"];
        this.myPrivateThingsText = translations["things.myPrivateThingsText"];
        this.textSeeAllPersonalPrivateThings = translations["things.textSeeAllPersonalPrivateThings"];
        this.textTitle = translations["things.textTitle"],
        this.textStatus = translations["things.textStatus"],
        this.textNothingPersonalThings = translations["things.textNothingPersonalThings"],
        this.textNothingPersonalPrivateThings = translations["things.textNothingPersonalPrivateThings"],
        this.add = translations["add"];
        this.myProfileText = translations["user.myProfileText"];
        this.errorEmailLogin = translations['errors.userNotFound'];
        this.errorPasswordLogin = translations['errors.password'];
        if (this.localStorageService.getLocalStorage("errorMessage")==="login"){
          this.messageError = translations['errorMessageAccessLoginFromProfil'];
        }

        if (!this.hasCheckError){
          this.checkError();
        }
      });
    }
  }

  update(): void{
    /*if (this.authService.isLoggedIn()){
      this.authService
      .update(this.authService.userId, this.userForm.value.name, this.userForm.value.email, this.userForm.value.password)
      .subscribe((msg) => {
        this.router.navigate(["update"]);
      });
    }*/
  }

  setStatus(status:string){
    if(status == "equal"){
      this.localStorageService.setLocalStorage("secondThingLinkUrlText",this.listAllIdenticalThingsText);
      this.localStorageService.setLocalStorage("thingStatut","cb==cpb");
    }
    else if(status == "good"){
      this.localStorageService.setLocalStorage("secondThingLinkUrlText",this.listAllGoodThingsText);
      this.localStorageService.setLocalStorage("thingStatut","cb>cpb");
    }
    else if(status=="notgood"){
      this.localStorageService.setLocalStorage("secondThingLinkUrlText",this.listAllNotGoodThingsText);
      this.localStorageService.setLocalStorage("thingStatut","cb<cpb");
    }
    else{
      this.localStorageService.setLocalStorage("secondThingLinkUrlText",this.listAllThingsText);
      this.localStorageService.setLocalStorage("thingStatut","");
    }
  }

  goToThing(thing: Thing, from: string, url: string){
    window.scroll(0,0);
    var status = "";
    if(thing.cb == thing.cpb && from == "things.listidenticalthings"){
      status = "equal"
    }
    else if (thing.cb > thing.cpb && from == "things.listgoodthings"){
      status = "good"
    }
    else if (thing.cb < thing.cpb && from == "things.listnotgoodthings"){
      status = "notgood"
    }

    this.setStatus(status);

    localStorage.setItem("fromUrl", "things/allthings/detailthing");
    this.router.navigate(['things/allthings/detailthing'],
    {
      state: {
        thing:thing,
        from: from,
        url: url
      }
    }
    );
  }

  ngAfterViewInit(): void
  {
    this.hasCheckError = false;
    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
      }
    );

    setTimeout(() => {
      this.changeLanguage();
    }, 0);
  }

  setMessageErrorComponent(message:string){
    if (this.messageComponent!=undefined){
      this.messageComponent.setMessage(message);
      if (this.messageError != ""){
        this.localStorageService.setLocalStorage("errorMessage","");
      }
    }
  }

  checkError():void{
    const arr: Array<any> = [this.thingsPersonal, this.thingsPrivate];
    this.errorService.checkError("profil", this.messageComponent, this.userForm, arr, this.messageError).subscribe(
      (actionNeeds)=>
        {
          console.log("actionNeeds = "+actionNeeds);
          this.hasCheckError = true;
          if (actionNeeds){
            //this.thingsReturnedPersonal = this.fetchAllPersonal();
            this.executeListing("");
            this.thingsPrivate = this.fetchAllPrivate();
          }
        }
    );
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}

import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateappService } from '../services/translateapp.service';
import { CountryService } from 'src/app/services/country.service';
import { Observable, of } from 'rxjs';
import { Country } from '../models/Country';
import { LangChangeEvent } from '@ngx-translate/core';
import { MessageComponent } from '../message/message.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupWindowComponent } from '../popup-window/popup-window.component';
import { CodeValidatePopupComponent } from '../shared/code-validate-popup/code-validate-popup.component';
import { TreatErrorMessageService } from '../services/shared/treat-error-message.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: false
})

export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  createAccountTitleText = "";
  usernameText = "";
  createText = "";
  emailText = "";
  passwordText = "";
  countryText = "";
  wellText = "";
  placeHolderUsernameText = "";
  placeHolderEmailText = "";
  placeHolderPasswordText = "";
  noSelected = "";
  langText = "";
  noSearchCountry = true;
  searchCountry = "";
  searchOption = "";
  emailAlreadyExist = "";
  nameAlreadyExist = "";
  propositionUserText = "";
  typeError = "";
  updateLanguageFirst = true;
  countries: Country[];
  idCountrySelected = 0;
  needValidWithCode = false;
  hovered = true;
  public country: Observable<Country[]>;

  public countryuser: Observable<any>;

  @ViewChild("countryContent", { read: ViewContainerRef }) countryRef: ViewContainerRef;
  @ViewChild("countryContentFr", { read: ViewContainerRef }) countryRefFr: ViewContainerRef;
  @ViewChild(MessageComponent) messageComponent: any;
  @ViewChildren('MessageComponent')
  public messageComponents: QueryList<MessageComponent>;

  @ViewChild('CodeValidate') codeValidateComponent: CodeValidatePopupComponent;
  @ViewChild('box', { static: false }) box: ElementRef;

  constructor(private authService: AuthService,
    private router: Router,
    public translate: TranslateappService,
    private countryService: CountryService,
    public dialog: MatDialog,
    private elementRef: ElementRef,
    private treatErrorMessage: TreatErrorMessageService,
    private userservice: UserService
    )
  {

  }

  ngOnInit(): void {
    this.signupForm = this.createFormGroup();
    this.langText = this.translate.translate.currentLang;
    this.checkFormGroup();
    this.translate.comp$.subscribe(
      () => {
        this.updateLanguage();
      }
    );
    this.updateLanguage();
    this.setCountries();
  }

  checkFormGroup(): void {
    if ((this.signupForm.controls['name'].value == "" && localStorage.getItem("typeError") == "nameAlreadyExist") ||
      (this.signupForm.controls['email'].value == "" && localStorage.getItem("typeError") == "emailAlreadyExist")) {
      localStorage.setItem("typeError", "");
      localStorage.setItem("erroOperationMessage", "");
      this.setErrorMessageSignup("");
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(7)]),
      idCountry: new FormControl("", [Validators.required])
    })
  }

  setCountries() {
    of(this.countryService.fetchAll(this.langText)).subscribe(
      {
        next: (v) => v.subscribe(
          {
            next: (v) => {
              this.country = of(v.countries);
              this.countries = v.countries;
            },
            error: (e) => console.error(e),
            complete: () => console.info('complete')
          }
        ),
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      });
  }

  setErrorMessageSignup(error: string) {
    if (this.messageComponent != undefined) {
      this.messageComponent.setMessage(error);
    }
  }

  openDialog(title: string, subText: string, value: string, type: string, valuePossible: string): void {
    const dialogRef = this.dialog.open(PopupWindowComponent, {
      data: { title: title, subText: subText, value: value, proposition: valuePossible },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (type === "username" && result != undefined) {
        this.signupForm.controls['name'].setValue(result);
        this.setErrorMessageSignup("");
        localStorage.setItem("errorOperationMessage", "");
      }
    });
  }

  onMouseOver(e: any) {
    this.hovered = true;
    (<HTMLDivElement>this.box.nativeElement).style.pointerEvents = 'auto';
    (<HTMLDivElement>this.box.nativeElement).style.cursor = 'pointer';
  }

  validWithAccount(e: any) {
    this.onMouseOver(e);
    this.needValidWithCode = false;
    this.signupForm.enable();
  }

  signup(): void {
    of(this.authService.signup(this.signupForm.value)).subscribe(
      {
        next: (v) => v.subscribe(
          {
            next:(v) => {
              if (v.message != "" && v.message!=undefined && v.message != null){
                const possibleErrorMessage = this.treatErrorMessage.treatErrorSignup(v.message.toString(), this.langText);
                if (possibleErrorMessage != null && possibleErrorMessage != undefined ){
                  this.setErrorMessageSignup(possibleErrorMessage);
                  window.scroll(0,0);
                }
                else{
                  if (this.messageComponent != ""){
                    this.setErrorMessageSignup("");
                  }
                  this.signupForm.disable();
                  this.needValidWithCode = true;
                  this.hovered = false;
                  this.codeValidateComponent.showPopup();
                }
              }
              else{
                if (this.messageComponent != ""){
                  this.setErrorMessageSignup("");
                }
                this.signupForm.disable();
                this.needValidWithCode = true;
                this.hovered = false;
                this.codeValidateComponent.showPopup();
              }
            },
            error: (e) => console.error(e),
            complete: () => console.info('complete') 
          }
        ),
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
    });
  }

  updateLanguage() {
    this.translate.translate.get(
      [
        'username',
        'email',
        "password",
        "login",
        "country",
        "well",
        "gooduser",
        "goodemail",
        "goodpassword",
        "createAccount",
        "createAccountTitle",
        "noSelected",
        "errors.emailAlreadyExist",
        "errors.nameAlreadyExist",
        "proposition.user"
      ]
    )
      .subscribe(translations => {
        this.usernameText = translations['username'];
        this.createText = translations['createAccount'];
        this.emailText = translations['email'];
        this.passwordText = translations['password'];
        this.countryText = translations['country'];
        this.wellText = translations['well'];
        this.placeHolderUsernameText = translations['gooduser'];
        this.placeHolderEmailText = translations['goodemail'];
        this.placeHolderPasswordText = translations['goodpassword'];
        this.createAccountTitleText = translations['createAccountTitle'];
        this.noSelected = translations['noSelected'];
        this.noSearchCountry = true;
        this.searchCountry = "";
        this.searchOption = translations["search"];
        this.emailAlreadyExist = translations["errors.emailAlreadyExist"];
        this.nameAlreadyExist = translations["errors.nameAlreadyExist"];
        this.propositionUserText = translations["proposition.user"];

        const errorOperation = localStorage.getItem("errorOperationMessage");
        if (errorOperation != "") {
          const typeError = localStorage.getItem("typeError");
          if (typeError === "emailAlreadyExist") {
            this.setErrorMessageSignup(this.emailAlreadyExist);
          }
          else if (typeError === "nameAlreadyExist") {
            this.setErrorMessageSignup(this.nameAlreadyExist);
          }
        }
        else {
          localStorage.setItem("typeError", "");
        }
      });
  }

  changeLanguage() {
    this.translate.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      if (this.elementRef.nativeElement.offsetParent != null) {
        this.updateLanguageFirst = false;
        this.langText = event.lang;
        this.updateLanguage();
      }
    });
  }
}

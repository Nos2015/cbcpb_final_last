import { Component, OnInit, QueryList, ChangeDetectorRef, AfterContentChecked, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TranslateappService } from '../services/translateapp.service';
import { MessageComponent } from '../message/message.component';
import { LinkComponent } from '../link/link.component';
import { ErrorService } from '../services/error.service';
import { of } from 'rxjs';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit, AfterContentChecked{
  loginForm!: FormGroup;
  loginText = "";
  loginTitleText = "";
  loginSuccessAddCode = "";
  emailText = "";
  passwordText = "";
  notWellText = "";
  placeHolderEmailText = "";
  placeHolderPasswordText = "";
  messageTextComponent = "";
  routerTo = "";

  previousUrl: string = '';

  //errors possible with login
  errorEmailLogin = "";
  errorPasswordLogin = "";
  errorFromProfil = "";
  errorFromCreate = "";
  errorFromValid = "";
  errorFromCreateValid = "";
  errorFromCreateValideCode = "";
  errorNeedLoginOrSignupToVote = "";
  successValidate = "";
  successValidateCode = "";
  writeSuccessValidateCode:boolean = false;
  hasCheckError:boolean = false;
  loginCodeValidateForm!: FormGroup;
  messageLogin = "";

  @ViewChild(MessageComponent) messageComponent: any;
  @ViewChildren('MessageComponent')
  public MessageComponents: QueryList<MessageComponent>;

  @ViewChild(LinkComponent) linkComponent: any;

  constructor(private authService: AuthService,
              public translate: TranslateappService,
              private changeDetector: ChangeDetectorRef,
              private errorService: ErrorService,
              private elementRef: ElementRef,
              private userService: UserService
              ){
  }

  ngOnInit(): void{
    this.loginForm = this.createFormGroup();
    this.loginCodeValidateForm = this.createValidateCodeFormGroup();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.hasCheckError = false;
      this.translate.comp$.subscribe(
        () => {
            this.changeLanguage();
        }
      );
      this.changeLanguage();
    });
  }

  createFormGroup(): FormGroup{
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(7)]),
    })
  }

  createValidateCodeFormGroup(): FormGroup{
    return new FormGroup({
      numCode1: new FormControl("", [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
      numCode2: new FormControl("", [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
      numCode3: new FormControl("", [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
      numCode4: new FormControl("", [Validators.required, Validators.maxLength(1), Validators.minLength(1)]),
      numCode5: new FormControl("", [Validators.required, Validators.maxLength(1), Validators.minLength(1)])
    })
  }

  login(): void{
    of(this.authService.login(this.loginForm.value.email, this.loginForm.value.password))
    .subscribe(
      {
        next: (v) => v.subscribe(
          {
            next:(v) => {
              if (v.message != "" && v.message!=undefined && v.message != null){
                this.messageLogin = v.message.toString();
                if (v.message.toString()=="false"){
                  this.messageLogin = "password";
                }
                else if (v.message.toString() == "true"){
                  this.messageLogin = "userValidateCode";
                  this.writeSuccessValidateCode = true;
                  if (this.messageLogin == "userValidateCode"){
                    this.changeCodeActivation();
                  }
                }
                this.setMessageLogin(this.messageLogin);
                window.scroll(0,0);
              }
              else{
                if (this.messageComponent != ""){
                    this.setMessageLogin("");
                }
              }
            },
            error: (e) => console.error(e),
            complete: () => {
              console.info('complete login end 1');
            }
          }
        ),
        error: (e) => console.error(e),
        complete: () => console.info('complete login end 2') 
    });
  }

  changeCodeActivation():void {
    //console.log("try to changeCodeActivation before send email to = "+this.loginForm.value.email);
    var successChangeCodeActivationStatus = "";
    var successChangeCodeActivationMessage = "";
    //change code activation
    of(this.authService.changeCodeActivation(this.loginForm.value.email)).subscribe({
        next: (v) => v.subscribe(
        {
          next:(v) => {
            //console.log("changeCodeActivation status = "+JSON.stringify(v.statusCode));
            successChangeCodeActivationStatus = JSON.stringify(v.statusCode);
            //console.log("successChangeCodeActivation =" +successChangeCodeActivationStatus);
            successChangeCodeActivationMessage = JSON.stringify(v.message);
            //console.log("successChangeCodeActivation =" +successChangeCodeActivationMessage);
            if(String(v.statusCode) == "success" && String(v.message) == "successChangeCodeActivation"){
              console.log("change code work call send");
              this.sendMailWithNewCodeActivation();
            }
            else{
              //check response is Error: SQLITE_BUSY: database is locked
              console.log("to sendCode not work");
            }
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

  sendMailWithNewCodeActivation():void{
    var successSendMailActivationStatus = "";
    var successSendMailctivationMessage = "";
    //change code activation
    of(this.authService.sendCode(this.loginForm.value.email)).subscribe({
        next: (v) => v.subscribe(
        {
          next:(v) => {
            //console.log("changeCodeActivation status = "+JSON.stringify(v.statusCode));
            successSendMailActivationStatus = JSON.stringify(v.statusCode);
            //console.log("successChangeCodeActivation =" +successSendMailActivationStatus);
            successSendMailctivationMessage = JSON.stringify(v.message);
            //console.log("successChangeCodeActivation =" +successSendMailctivationMessage);
            if(String(v.statusCode) == "success" && String(v.message) == "successChangeCodeActivation"){
              console.log("sendCode work");
            }
            else{
              console.log("to sendCode not work");
            }
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

  checkCode(): void{
    of(this.authService.checkCode(this.loginForm.value.email, this.loginForm.value.password, this.loginCodeValidateForm.value.numCode1, this.loginCodeValidateForm.value.numCode2, this.loginCodeValidateForm.value.numCode3, this.loginCodeValidateForm.value.numCode4, this.loginCodeValidateForm.value.numCode5))
    .subscribe(
      {
        next: (v) => v.subscribe(
          {
            next:(v) => {
              var response = JSON.parse(JSON.stringify(v));
              const email = response.email;
              const name = response.name;
              const id = response.id;
              const country = response.country;
              const continent = response.continent;
              const message = response.message;
              /*console.log("response = "+response);
              console.log("email = "+response.email);
              console.log("name = "+response.name);
              console.log("id = "+response.id);
              console.log("country = "+response.country);
              console.log("message = "+response.message);*/
              /*var responseWithoutSlash = JSON.stringify(v).replace(/\\/g, '');
              var responseReplaceFirstChar = responseWithoutSlash.replace(responseWithoutSlash.charAt(0),"'");
              var responseAddCharAtTheEndOfChar = responseReplaceFirstChar.substring(0, responseReplaceFirstChar.length)+"'";
              var removeLastCharAtThend = responseAddCharAtTheEndOfChar.slice(0, -2)+"'"; 
              console.log("removeLastCharAtThend = "+removeLastCharAtThend);
              var response = JSON.parse(removeLastCharAtThend);
              */
              if (response.message != "" && response.message!=undefined && response.message != null){
                this.messageLogin = response.message.toString();
                //console.log("message response = "+response.message.toString());
                if (response.message.toString()=="errorCodeActivation"){
                  this.messageLogin = "validcode";
                }
                else if (response.message.toString() == "success"){
                  // go to home login user
                  const userLogged: User = {
                      id: id,
                      name: name,
                      email: email,
                      password: "",
                      idCountry: country,
                      idContinent: continent,
                      codeActivation: 0,
                      canprivate: 0,
                      message: message
                  };
                  //console.log("id user login = "+id);
                  //console.log("email user login = "+email);
                  this.userService.setUserId(id);
                  this.userService.setUserEmail(email);
                  this.userService.setUserCountry(country);
                  this.userService.setUserContinent(continent);
                  this.authService.loginSuccess();
                }
                localStorage.setItem("errorOperationMessage","");
                this.setMessageLogin(this.messageLogin);
                window.scroll(0,0);
              }
              else{
                if (this.messageComponent != ""){
                    this.setMessageLogin("");
                }
              }
            },
            error: (e) => console.error(e),
            complete: () => {
              console.info('complete login end 1');
            }
          }
        ),
        error: (e) => console.error(e),
        complete: () => console.info('complete login end 2') 
    });
  }

  setMessageLogin(type:string){
    /** Check type of message*/
    /** Errors messages */
    if (type === "profil"){
      this.messageTextComponent = this.errorFromProfil;
    }
    else if (type ==="create-things"){
      this.messageTextComponent = this.errorFromCreate;
    }
    else if(type === "userNotFound"){
      this.messageTextComponent = this.errorEmailLogin;
    }
    else if (type === "userNotValid"){
      this.messageTextComponent = this.errorFromValid;
      this.linkComponent.setDisplayLink(true);
      this.linkComponent.setUrl("/code");
      this.linkComponent.setColor("red");
      this.linkComponent.setPaddingTop("20px");
      this.linkComponent.setTextLink("Valider le compte avec le code c'est bien");
      this.linkComponent.addElementSend({email:this.loginForm.value.email});
    }
    else if (type === "validNotPossible"){
      this.messageTextComponent = this.errorFromCreateValid;
    }
    else if (type === "password"){
      this.messageTextComponent = this.errorPasswordLogin;
    }
    else if (type === "validuser"){
      this.messageTextComponent = this.errorFromCreateValid;
    }
    else if (type === "validcode"){
      this.messageTextComponent = this.errorFromCreateValideCode;
    }
    else if (type === "vote"){
      this.messageTextComponent = this.errorNeedLoginOrSignupToVote;
    }

    if (this.messageComponent!=undefined){
      /** Success message where user validate code to have a valid account */
      if (type === "userValidate" || type === "userValidateCode"){
        this.messageComponent.setColorMessage("green");
          if (type === "userValidate"){
            this.messageTextComponent = this.successValidate;
          }
          else{
            this.messageTextComponent = this.successValidateCode;
          }
      }
      else{
        this.messageComponent.setColorMessage("red");
      }
      this.messageComponent.setMessage(this.messageTextComponent);
    }
  }

  changeLanguage(){
    //changeLanguage when page is on front
    if(this.elementRef.nativeElement.offsetParent != null) {
      this.translate.translate.get(
        [
          'email',
          "password",
          "login",
          "loginTitleText",
          "login",
          "loginSuccessAddCode",
          "goodemail",
          "goodpassword",
          "errorMessageAccessProfilLogin",
          "errorMessageAccessCreateLogin",
          "errorMessageAccessValid",
          "errorMessageAccess",
          "errors.userNotFound",
          "errors.password",
          "errors.validuser",
          "errors.validcode",
          "errors.needLoginOrSignupToVote",
          "success.userValidate",
          "success.userValidateCode"
        ]
      )
      .subscribe(translations => {
        this.loginText = translations['login'];
        this.loginTitleText = translations['loginTitleText'];
        this.loginSuccessAddCode = translations['loginSuccessAddCode'];
        this.emailText = translations['email'];
        this.passwordText = translations['password'];
        this.notWellText = translations['notwell'];
        this.placeHolderEmailText = translations['goodemail'];
        this.placeHolderPasswordText = translations['goodpassword'];
        this.errorEmailLogin = translations['errors.userNotFound'];
        this.errorPasswordLogin = translations['errors.password'];
        this.errorFromProfil = translations['errorMessageAccessProfilLogin'];
        this.errorFromCreate = translations['errorMessageAccessCreateLogin'];
        this.errorFromValid  = translations['errorMessageAccessValid'];
        this.errorFromCreateValid = translations['errors.validuser'];
        this.errorFromCreateValideCode = translations['errors.validcode'];
        this.errorNeedLoginOrSignupToVote = translations['errors.needLoginOrSignupToVote'];
        this.successValidate = translations["success.userValidate"];
        this.successValidateCode = translations["success.userValidateCode"];
        const errorMessage = localStorage.getItem("errorOperationMessage");
        if (errorMessage!=null && errorMessage!=""){
          this.setMessageLogin(errorMessage);
        }

        if (!this.hasCheckError){
          this.checkError();
        }
      });
    }
  }

  checkError():void{
    const arr: Array<any> = [];
    const formGroup = new FormGroup({});
    //console.log("checkError from login");
    this.errorService.checkError("login", this.messageComponent, formGroup, arr, this.messageTextComponent).subscribe(
      ()=>
        {
          this.hasCheckError = true;
        }
    );
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  /**Validate Code */
  
}

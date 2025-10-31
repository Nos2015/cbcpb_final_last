import { AfterContentChecked, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';
import { AuthService } from '../services/auth.service';
import { TranslateappService } from '../services/translateapp.service';
import { ErrorService } from '../services/error.service';
import { FormGroup } from '@angular/forms';
import { LocalstorageService } from '../services/localstorage.service';
import { MessageComponent } from '../message/message.component';

@Component({
    selector: 'app-validuser',
    templateUrl: './validuser.component.html',
    styleUrls: ['./validuser.component.scss'],
    standalone: false
})
export class ValiduserComponent implements OnInit, AfterContentChecked{

  titleText = "";
  hasCheckError:boolean = false;
  code = "";
  validate = "";
  resendCode = "";
  explainCode = "";
  errorCode = "";
  errorNotCompleteCode = "";
  errorEmailCode = "";
  successValidate = "";
  notSignupToAccessValidCode = "";
  messageError = "";
  emailUser = "";
  emailUserPassed = "";

  @ViewChild(MessageComponent) messageComponent: any;

  @ViewChildren('MessageComponent')
  public messageComponents: QueryList<MessageComponent>;

  constructor(private authService: AuthService,
              private router: Router,
              public translate: TranslateappService,
              private errorService: ErrorService,
              private localStorageService: LocalstorageService,
              private activatedRoute: ActivatedRoute,
    ){
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.dir(params);
      this.emailUserPassed = params['email'];
    });
  }

  ngAfterViewInit(): void
  {
    this.hasCheckError = false;
    this.emailUser = this.authService.getMailUser();
    if (this.emailUser === "" && this.emailUserPassed !=""){
      this.emailUser = this.emailUserPassed;
    }

    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
      }
    );
    this.changeLanguage();
  }

  onCodeChanged(token: string){
    this.code = token;
  }

  onCodeCompleted(token: string) {
    //throw new Error('Method not implemented.');
    this.code = token;
  }

  submitCode(){
    if(this.code.length != 5 || this.code == ""){
      //this.localStorageService.setLocalStorage("errorMessage",this.errorCode);
      this.setMessageErrorComponent(this.errorNotCompleteCode);
    }
    else{
      if (this.emailUser == "" || this.emailUser == null){
        this.messageError = this.notSignupToAccessValidCode;
        this.checkError("validuser");
      }
      else{
        /*this.authService
        .checkCode(parseInt(this.code), this.emailUser)
        .subscribe(
          (response) => {
            const errorOperation  = localStorage.getItem("errorOperationMessage")!;
            if (errorOperation!=="" && errorOperation!=null && errorOperation==="userNotFound"){
              const errorCode = this.errorCode;
              localStorage.setItem("errorOperationMessage","");
              this.setMessageErrorComponent(errorCode);
            }
            else{
              this.authService.validateCode(response.userId).subscribe(
                (resp) => {
                  const errorOperation  = localStorage.getItem("errorOperationMessage")!;
                  if (errorOperation!=="" && errorOperation!=null && errorOperation==="userNotFound"){
                    const errorCode = this.errorCode;
                    localStorage.setItem("errorOperationMessage","");
                    this.setMessageErrorComponent(errorCode);
                  }
                  else{
                    if (resp.fieldCount === 0 &&
                      resp.affectedRows === 1 &&
                      resp.info === "Rows matched: 1  Changed: 1  Warnings: 0" &&
                      resp.serverStatus  === 2 &&
                      resp.warningStatus === 0 &&
                      resp.changedRows === 1
                    ){
                      this.localStorageService.setLocalStorage("fromUrl","validUser");
                      this.localStorageService.setLocalStorage("successOperationMessage",this.successValidate);
                      this.router.navigate(["login"]);
                    }
                  }
                }
              );
            }
          }
        )*/
      }
    }
  }

  changeLanguage(){
    this.translate.translate.get(
      [
        'codeSecurity.codeTitleCreation',
        'codeSecurity.validateCode',
        'codeSecurity.codeExplainCreation',
        'codeSecurity.resendCode',
        'errors.notCompleteCode',
        'errors.errorCodeMail',
        'errors.validuser',
        'errors.validCode',
        'success.userValidate'
      ]
    )
    .subscribe(translations => {
      this.titleText = translations['codeSecurity.codeTitleCreation'];
      this.validate = translations['codeSecurity.validateCode'];
      this.explainCode = translations['codeSecurity.codeExplainCreation'];
      this.resendCode = translations['codeSecurity.resendCode'];
      this.errorNotCompleteCode = translations['errors.notCompleteCode'];
      this.notSignupToAccessValidCode = translations['errors.validuser'];
      this.errorCode = translations['errors.validCode'];
      this.successValidate = translations['success.userValidate'];
      if (!this.hasCheckError && this.emailUser == ""){
        this.messageError = this.notSignupToAccessValidCode;
        this.checkError("validuser");
      }

    });
  }

  setMessageErrorComponent(message:string){
    if (this.messageComponent!=undefined){
      this.messageComponent.setMessage(message);
      if (this.messageError != ""){
        this.localStorageService.setLocalStorage("errorMessage","");
      }
    }
  }

  checkError(pageSet: string):void{
    const arr: Array<any> = [];
    const form: FormGroup<any> = new FormGroup({});
    this.errorService.checkError(pageSet, this.messageComponent, form, arr, this.messageError).subscribe(
      ()=>
        {
          this.hasCheckError = true;
        }
    );
  }

  ngAfterContentChecked(): void {
    //this.changeDetector.detectChanges();
  }

}

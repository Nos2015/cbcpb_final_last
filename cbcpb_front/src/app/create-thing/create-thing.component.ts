import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateappService } from '../services/translateapp.service';
import { ThingsService } from '../services/things.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LocalstorageService } from '../services/localstorage.service';
import { ErrorService } from '../services/error.service';

@Component({
    selector: 'app-create-thing',
    templateUrl: './create-thing.component.html',
    styleUrls: ['./create-thing.component.scss'],
    standalone: false
})
export class CreateThingComponent implements OnInit, AfterContentChecked{

  proposeForm!: FormGroup;
  messageError = "";
  message = "";
  createOrProposeThingText = "";
  typeVoteText = "";
  generalVoteText = "";
  generalExplicationVoteText = "";
  privateVoteText = "";
  privateExplicationVoteText = "";
  thingToVoteText = "";
  placeHolderThingText = "";
  descriptionThingToVoteText = "";
  placeHolderDescriptionThingText = "";
  proposeText = "";
  notWellText = "";
  needToChoosePrivateText = "";
  requiredFieldText="";

  generalChecked:boolean = true;
  privateChecked:boolean = false;
  canprivate:boolean = false;

  colorCheckBox  = "primary";

  hasCheckError:boolean = false;

  @ViewChild(MessageComponent) messageComponent: any;
  @ViewChildren('MessageComponent')
  public messageComponents: QueryList<MessageComponent>;

  constructor(private authService: AuthService,
              private router: Router,
              public translate: TranslateappService,
              private thingService: ThingsService,
              private changeDetector: ChangeDetectorRef,
              private localStorageService: LocalstorageService,
              private errorService: ErrorService){

  }

  setMessageComponent(message:string, type:string){
    if (this.messageComponent!=undefined){
      this.messageComponent.setMessage(message);
      if (type ==="error" && this.messageError != ""){
        this.localStorageService.setLocalStorage("errorMessage","");
      }
      else if (type ==="good" && this.message != ""){
        this.localStorageService.setLocalStorage("message","");
      }
    }
  }

  ngOnInit(): void{
    this.proposeForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup{
    return new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl()
    })
  }

  changeLanguage(){
    this.translate.translate.get(
      [
        "errorMessageAccessLoginFromCreate",
        "creating-things.proposeVoteThingText",
        "creating-things.createVoteThingText",
        "creating-things.thingToVoteText",
        "creating-things.proposeText",
        "creating-things.placeHolderThingText",
        "creating-things.descriptionThingToVoteText",
        "creating-things.placeHolderDescriptionThingText",
        "creating-things.typeVoteText",
        "creating-things.generalVoteText",
        "creating-things.generalExplicationVoteText",
        "creating-things.privateVoteText",
        "creating-things.privateExplicationVoteText",
        "creating-things.needToChoosePrivateText",
        "creating-things.requiredField",
        "notwell"
      ]
    )
    .subscribe(translations => {
      if (this.localStorageService.getLocalStorage("errorMessage")==="login"){
        this.messageError = translations['errorMessageAccessLoginFromCreate'];
      }
      this.createOrProposeThingText = translations['creating-things.proposeVoteThingText'];
      this.thingToVoteText = translations['creating-things.thingToVoteText'];
      this.proposeText = translations['creating-things.proposeText'];
      this.typeVoteText = translations["creating-things.typeVoteText"];
      this.placeHolderThingText = translations["creating-things.placeHolderThingText"];
      this.descriptionThingToVoteText = translations["creating-things.descriptionThingToVoteText"];
      this.placeHolderDescriptionThingText = translations["creating-things.placeHolderDescriptionThingText"];
      this.generalVoteText = translations["creating-things.generalVoteText"];
      this.generalExplicationVoteText = translations["creating-things.generalExplicationVoteText"];
      this.privateVoteText = translations["creating-things.privateVoteText"];
      this.privateExplicationVoteText = translations["creating-things.privateExplicationVoteText"];
      this.needToChoosePrivateText = translations["creating-things.needToChoosePrivateText"];
      this.requiredFieldText = translations["creating-things.requiredField"];
      this.notWellText = translations['notwell'];

      if (!this.hasCheckError){
        this.checkError();
      }
    });
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

    /*this.errorMessageComponents.changes.subscribe((comps: QueryList <ErrormessageComponent>) =>
    {
        this.errorMessageComponent = comps.first;
        this.errorMessageComponent.setErrorMessage(this.messageError);
    });*/
  }

  checkError():void{
    const arr: Array<any> = [];
    const formGroup = new FormGroup({});
    //console.log("checkError from create-thing");
    this.errorService.checkError("create-things", this.messageComponent, formGroup, arr, this.messageError).subscribe(
      ()=>
        {
          this.hasCheckError = true;
        }
    );
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  propose():void{
    //console.log("propose create-thing isLoggedIn");
    if (this.authService.isLoggedIn()){
      /*this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        () => {
          const errorOperation  = localStorage.getItem("errorOperationMessage")!;
          if (errorOperation!=="" && errorOperation!=null){
            this.setMessageLogin(errorOperation);
          }
        }
      );*/
    }
  }

  toggleSelection(checkbox: MatCheckboxChange, generalTouch:boolean) {
    if (!this.canprivate){
      if(generalTouch){
        if (checkbox.checked) {
          this.generalChecked = true;
          this.privateChecked = false;
        }
        else{
          this.generalChecked = false;
          this.privateChecked = true;
        }
      }
      else{
        if (checkbox.checked) {
          this.generalChecked = false;
          this.privateChecked = true;
        }
        else{
          this.generalChecked = true;
          this.privateChecked = false;
        }
      }
    }
  }
}

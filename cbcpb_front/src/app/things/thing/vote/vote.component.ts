import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LangChangeEvent } from '@ngx-translate/core';
import { Observable, from, of } from 'rxjs';
import { MessageComponent } from 'src/app/message/message.component';
import { ResultBackEnd } from 'src/app/models/ResultBackEnd';
import { Thing } from 'src/app/models/Thing';
import { PopupDialogComponent } from 'src/app/popup-dialog/popup-dialog.component';
import { ErrorService } from 'src/app/services/error.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ThingsService } from 'src/app/services/things.service';
import { TranslateappService } from 'src/app/services/translateapp.service';
import { UserService } from 'src/app/services/user.service';
import { VotethingService } from 'src/app/services/votething.service';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.scss'],
    standalone: false
})

export class VoteComponent implements OnInit{
  public thing: Thing ={
    id: 0,
    name: "",
    description: "",
    date:new Date(),
    cb: 0,
    cpb: 0,
    added: 0,
    idUser: 0,
    image:"",
    name_fr: "",
    things_type_id: 0
  };

  allThingsText = "";
  secondThingLinkText = "";
  secondThingLinkUrlText = "";
  secondThingLinkFrom = "";

  langText = "";
  updateLanguageFirst = true;

  hasCheckError = false;

  thingObservable: Observable <Thing[]>;

  votetitle = "";
  votegoodtext = "";
  votenotgoodtext = "";
  votealreadytext = "";
  votenotyettext = "";
  voteareyousure = "";
  votefinishnotsuccess = "";
  votefinishsuccess = "";
  cancelVote = "";
  validateVote = "";

  typeVote = "";

  status = "";

  @ViewChild(MessageComponent) messageComponent: any;
  @ViewChildren('MessageComponent')
  public MessageComponents: QueryList<MessageComponent>;

  constructor(private router: Router,
    public translate: TranslateappService,
    private elementRef: ElementRef,
    private thingService: ThingsService,
    private errorService: ErrorService,
    private localStorageService: LocalstorageService,
    private voteService: VotethingService,
    private userService: UserService,
    private dialog: MatDialog){
}

  ngOnInit(): void {
    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
      }
    );
    this.changeLanguage();
  }

  checkError():void{
    console.log("CHECk ERROR things/allthings/detailthing/vote");
    this.errorService.checkError("things/allthings/detailthing/vote", this.messageComponent, null, null, null).subscribe(
      (actionNeeds)=>
        {
          if (actionNeeds){
            let recupThing = history.state.thing;
            if (recupThing == undefined){
              let idThing = this.localStorageService.getLocalStorage("currentThing");
              let secondUrl = this.localStorageService.getLocalStorage("secondThingLinkUrl");
              console.log("secondUrl = "+secondUrl);
              let secondUrlText = this.localStorageService.getLocalStorage("secondThingLinkUrlText");
              console.log("secondUrlText = "+secondUrlText);
              let secondFromText = this.localStorageService.getLocalStorage("secondThingLinkFromText");
              console.log("secondFromText = "+secondFromText);
              if(secondUrl!= null){
                this.secondThingLinkUrlText = secondUrl;
              }
              if(secondUrlText!= null){
                this.secondThingLinkText = secondUrlText;
              }
              if (secondFromText!=null){
                this.secondThingLinkFrom = secondFromText;
              }
              
              let currentThingId = this.localStorageService.getLocalStorage("currentThing");
              if(currentThingId != null || currentThingId != undefined){
                console.log("currentThing id = "+currentThingId);
                of(this.thingService.fetchThingFromId(+currentThingId)).subscribe({
                  next: (v) => v.subscribe(
                  {
                    next:(v) => {
                      if(v.message == "success" && v.things.length>0){
                        let things = v.things as Array<any>;
                        for (let i = 0; i < things.length; i++) {
                            let thing = things[i] as Thing;
                            this.thing = thing;
                        }
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
              else{
                console.log("no thing");
              }
            }
            else{
              this.thing = recupThing;
              this.secondThingLinkFrom = history.state.from;
              this.secondThingLinkUrlText = history.state.url;
            }
          }
        }
    );
  }

  updateLanguage(language:string){
    this.langText = language;
    this.translate.translate.get(
      [
        "header.research",
        "vote",
        "cancel",
        "things.allthings",
        "things.listallthings",
        "things.listgoodthings",
        "things.listnotgoodthings",
        "things.listidenticalthings",
        "things.listmythings",
        "things.vote.votegoodtext",
        "things.vote.votenotgoodtext",
        "things.vote.votealreadytext",
        "things.vote.votenotyettext",
        "things.vote.votefinishsuccess",
        "things.vote.votefinishnotsuccess",
        "codeSecurity.validateCode"
      ]
    )
    .subscribe(translations => {
      this.allThingsText = translations["things.allthings"];
      let status = this.localStorageService.getLocalStorage("thingStatut");
      if(status != null){
        this.status = status;
      }
      this.status= this.status;
      this.cancelVote = translations["cancel"];
      this.votegoodtext = translations["things.vote.votegoodtext"];
      this.votenotgoodtext = translations["things.vote.votenotgoodtext"];
      this.votealreadytext = translations["things.vote.votealreadytext"];
      this.votenotyettext = translations["things.vote.votenotyettext"];
      this.votefinishsuccess = translations["things.vote.votefinishsuccess"];
      this.votefinishnotsuccess = translations["things.vote.votefinishnotsuccess"];
      this.votetitle = translations["vote"];
      this.validateVote = translations["codeSecurity.validateCode"];
      if (!this.hasCheckError){
        this.checkError();
      }

      /*if(this.status == "cb>cpb"){
        this.secondThingLinkText = translations['things.listgoodthings'];
      }
      else if (this.status == "cb<cpb"){
          this.secondThingLinkText = translations['things.listnotgoodthings'];
      }
      else if (this.status == "cb==cpb"){
        this.secondThingLinkText = translations['things.listidenticalthings'];
      }
      else{
        this.secondThingLinkText = translations['things.listallthings'];
      }*/

      let checkIsFromMyThings = this.localStorageService.getLocalStorage("secondThingLinkFromText");
      if(checkIsFromMyThings != null && checkIsFromMyThings != undefined && checkIsFromMyThings != ""){
        this.secondThingLinkText = translations[checkIsFromMyThings];
      }
      
    });
  }

  changeLanguage(){
    this.translate.translate.onLangChange.subscribe((event: LangChangeEvent)=> {
      if(this.elementRef.nativeElement.offsetParent != null) {
        this.updateLanguageFirst = false;
        this.updateLanguage(this.translate.translate.currentLang);
      }
    });

    if(this.elementRef.nativeElement.offsetParent != null) {
      if (this.updateLanguageFirst!=false){
        this.updateLanguage(this.translate.translate.currentLang);
      }
    }
  }

  goToThing(thing: Thing, from: string, url: string){
    window.scroll(0,0);
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

  vote(typeVote:string){
    console.log("vote = "+typeVote);
    //Check user vote or not
    let idUser = this.userService.getUserId();
    if(idUser != undefined && idUser != null){
      of(this.voteService.checkUserVote(+idUser,this.thing.id)).subscribe({
          next: (v) => v.subscribe(
          {
            next:(v) => {
              var response = JSON.parse(JSON.stringify(v));
              const message = response.message;
              if(message == "success"){
                let things = v.things;
                if(things.length == 1){
                  let thing = things[0] as ResultBackEnd;
                  console.log('result things = '+thing.result);
                  if (thing.result == 1){
                    this.userAlreadyVote();
                  }
                  else{
                    this.typeVote = typeVote;
                    this.userWantToVote();
                  }
                }
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
  }

  userAlreadyVote(): void {
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      width: '350px',
      data: { 
        title: this.votetitle,
        message: this.votealreadytext,
        hasRightButton:true,
        textRightButton: "Ok"
      },

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed');
      } else {
        console.log('User cancelled');
      }
    });
  }

  userWantToVote(): void {
    console.log("userWantToVote");
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      width: '350px',
      data: { 
        title: this.votetitle,
        message: this.votenotyettext,
        hasLeftButton:true,
        textLeftButton:this.cancelVote,
        hasRightButton:true,
        textRightButton: this.validateVote,
      },

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed');
        this.confirmvoteAddVoteThings();
      } else {
        this.typeVote ="";
        console.log('User cancelled');
      }
    });
  }

  confirmvoteAddVoteThings(){
    //Set vote and user voted thing
    let idCountry = this.userService.getUserCountry();
    let idContinent = this.userService.getUserContinent();
    let cb = 0;
    let cpb = 0;
    if(this.typeVote == "good"){
      cb = 1;
    }
    else if (this.typeVote == "notgood"){
      cpb = 1;
    }

    if((idCountry != undefined && idCountry != null) && (idContinent != undefined && idContinent != null)){
      of(this.voteService.addVoteThings(this.thing.id,+idCountry,+idContinent,cb, cpb, this.thing.name, this.thing.name_fr)).subscribe({
          next: (v) => v.subscribe(
          {
            next:(v) => {
              var response = JSON.parse(JSON.stringify(v));
              console.log("response = "+response.message);
              if(response.message == "success"){
                this.updateThingWithValues(cb,cpb);
              }
              else{
                //add message on screen error
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
  }
  
  updateThingWithValues(cb:number, cpb:number){
    console.log("updateThingWithValues with cb="+cb+" and cpb="+cpb);
    if((cb==1 && cpb==0)||(cb==0 && cpb==1)){
      cb = this.thing.cb+cb;
      cpb = this.thing.cpb+cpb;
      console.log("cb = "+cb);
      console.log("cpb = "+cpb);
      of(this.voteService.addVoteUpdateThing(this.thing.id, cb, cpb)).subscribe({
          next: (v) => v.subscribe(
          {
            next:(v) => {
              var response = JSON.parse(JSON.stringify(v));
              console.log("response = "+response.message);
              if(response.message == "success"){
                this.thing.cb = cb;
                this.thing.cpb = cpb;
                this.confirmvoteAddVoteUsers();
              }
              else{
                //add message on screen error && remove addVoteThings
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
  }

  confirmvoteAddVoteUsers(){
    let idUser = this.userService.getUserId();
    if(idUser != undefined && idUser != null){
      of(this.voteService.addVotesUsers(this.thing.id,+idUser)).subscribe({
          next: (v) => v.subscribe(
          {
            next:(v) => {
              var response = JSON.parse(JSON.stringify(v));
              console.log("response = "+response.message);
              if(response.message == "success"){
                //return popup to success
                this.addPopupToScreen(this.votetitle, this.votefinishsuccess, false, "", true, "Ok",false,"",true,"things/allthings/detailthing");
              }
              else{
                //add popup on screen error && remove addVoteThings && addVoteUpdateThing
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
  }

  addPopupToScreen(title:string, message:string, hasLeftButton:boolean, textLeftButton:string, hasRightButton:boolean, textRightButton:string, hasLeftLink:boolean, textLeftLink:string, hasRightLink:boolean, texRightLink:string){
    const dialogRef = this.dialog.open(PopupDialogComponent, {
      width: '350px',
      data: { 
        title: title,
        message: message,
        hasLeftButton:hasLeftButton,
        textLeftButton:textLeftButton,
        hasRightButton:hasRightButton,
        textRightButton: textRightButton,
      },

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed');
        if(hasRightLink){
          console.log('Has right Link');
          console.log('Link = '+texRightLink);
          console.log("history.state.from = "+history.state.from);
          console.log("history.state.url = "+history.state.url);
          localStorage.setItem("fromUrl",texRightLink);
          console.log("secondThingLinkUrlText = "+this.secondThingLinkUrlText);
          console.log("secondThingLinkUrlText = "+this.secondThingLinkText);
          console.log("localStorage.getItem('secondThingLinkFromText') = "+localStorage.getItem("secondThingLinkFromText"));
          //localStorage.setItem("secondThingLinkFromText",this.secondThingLinkUrlText);
          this.router.navigate([texRightLink],
          {
            state: {
              thing:this.thing,
              from: localStorage.getItem("secondThingLinkFromText"),
              url: this.secondThingLinkUrlText
            }
          }
          );
        }
      } else {
        this.typeVote ="";
        console.log('User cancelled');
        if(hasLeftLink){
          this.router.navigate([textLeftLink]);
        }
      }
    });
  }
}



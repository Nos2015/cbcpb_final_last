import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Thing } from '../../models/Thing';
import { Observable, of } from 'rxjs';
import { ThingsService } from '../../services/things.service';
import { Router } from '@angular/router';
import { TranslateappService } from 'src/app/services/translateapp.service';
import { ErrorService } from 'src/app/services/error.service';
import { MessageComponent } from 'src/app/message/message.component';
import { FormGroup } from '@angular/forms';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { TypethingService } from 'src/app/services/typething.service';
import { Type } from 'src/app/models/Type';

@Component({
    selector: 'app-mythings',
    templateUrl: './mythings.component.html',
    styleUrls: ['./mythings.component.scss'],
    standalone: false
})
export class MythingsComponent implements OnInit{
  @ViewChild(PaginationComponent) paginationComponent:PaginationComponent;
  myThings: Observable<Thing[]>;
  userThings: Array<Thing>= [];
  things: Observable<{
      things: any;
      message: String
  }>

  allThingsText = "";
  listAllMyThingsText = "";
  listAllThingsText = "";
  listAllGoodThingsText = "";
  listAllNotGoodThingsText = "";
  listAllIdenticalThingsText = "";
  textSeeAllMyThings = "";
  textTitle = "";
  textStatus = "";
  textNothingPersonalThings = "";
  add = "";
  hasCheckError:boolean = false;
  nameThing ="";
  searchLabel = "";
  timeout: any = null;
  searchThingInList = "";
  searchThingTypeInList = "0";
  textCb = "";
  textCpb = "";

  totalThings = 0;
  totalSeeThings = 0;
  currentPage = 1;
  selected ="0";
  statut = "";

  textType = "";
  allTypeThing = "";
  textSearchTypeThing = "";

  @ViewChild(MessageComponent) messageComponent: any;
  @ViewChildren('MessageComponent')
  public MessageComponents: QueryList<MessageComponent>;

  typeAllThings: Observable<Type[]>;
  typeAllThingsArray: Array<Type>= [];

  constructor(private thingService: ThingsService,
            private router: Router,
            public translate: TranslateappService,
            private elementRef: ElementRef,
            private errorService: ErrorService,
            private localStorageService: LocalstorageService,
            private typeThingService: TypethingService,){
  }

  ngOnInit(): void{
    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
          //this.updateAllTen(this.selected, this.currentPage, this.statut);
          this.getAllThingsUser();
      }
    );
    setTimeout(() => {
      this.changeLanguage();
    }, 0);
  }

  changeLanguage(){
    if(this.elementRef.nativeElement.offsetParent != null) {
      this.translate.translate.get(
        [
          "things.allthings",
          "things.listallthings",
          "things.listgoodthings",
          "things.listnotgoodthings",
          "things.listidenticalthings",
          "things.listmythings",
          "things.textSeeAllMyThings",
          "things.textTitle",
          "things.textStatus",
          "things.textNothingPersonalThings",
          "things.textType",
          "things.textSearchTypeThing",
          "things.textCb",
          "things.textCpb",
          "add",
          "header.research"
        ]
      )
      .subscribe(translations => {
        this.allThingsText = translations['things.allthings'];
        this.listAllThingsText = translations['things.listallthings'];
        this.listAllGoodThingsText = translations['things.listgoodthings'];
        this.listAllNotGoodThingsText = translations['things.listnotgoodthings'];
        this.listAllIdenticalThingsText = translations['things.listidenticalthings'];
        this.listAllMyThingsText = translations['things.listmythings'];
        this.textSeeAllMyThings = translations['things.textSeeAllMyThings'];
        this.textTitle = translations['things.textTitle'];
        this.textStatus = translations['things.textStatus'];
        this.textNothingPersonalThings = translations['things.textNothingPersonalThings'];
        this.add = translations["add"];
        this.searchLabel = translations['header.research'];
        this.textCb = translations['things.textCb'];
        this.textCpb = translations['things.textCpb'];
        this.textType = translations['things.textType'];
        this.textSearchTypeThing = translations['things.textSearchTypeThing'];
      
        let name = this.localStorageService.getLanguageApplication();
        if (name == null){
          this.nameThing = "";
        }
        else{
          this.nameThing = name;
        }

        if (!this.hasCheckError){
          this.checkError();
        }
      });
    }
  }

  getTypeThings(language:string, type:string):void{
    of(this.typeThingService.fetchAll(language, type)).subscribe({
        next: (v) => v.subscribe(
        {
          next:(v) => {
            if(v.message == "success" && v.types.length>0){
              let types = v.types as Array<any>;
              for (let i = 0; i < types.length; i++) {
                  let type = types[i] as Type;
                  this.typeAllThingsArray.push(type);
              }
            }
            this.typeAllThings= of(this.typeAllThingsArray);
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

  fetchCountAll(language:string):void{
    of(this.thingService.fetchAllCountUser(this.selected, this.statut, this.searchThingInList, language)).subscribe({
        next: (v) => v.subscribe(
        {
          next:(v) => {
            if(v.message == "success" && v.thingsCount != undefined && v.thingsCount != null && v.thingsCount!=0){
              this.totalThings = v.thingsCount[0].thingsTotal;
              this.paginationComponent.setTotalItems(this.totalThings);
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

  updateMyThings(value:string, language:string, currentPage:number, statut:string, searchThingInList:string):void{
    console.log("UPDATEMYTHINGS");
    of(this.thingService.fetchAllPersonalByPage(value, language, currentPage, statut, searchThingInList)).subscribe({
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
            this.myThings = of(this.userThings);
            this.fetchCountAll(language);
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
    console.log("selected type = "+this.selected);
    console.log("searchThingTypeInList = "+this.searchThingTypeInList);
    this.userThings = [];
    this.typeAllThingsArray = [];
    let language = this.localStorageService.getLanguageApplication();
    //change code activation
    this.getTypeThings(language, this.selected);
    this.updateMyThings(this.selected, language, this.currentPage, this.statut, this.searchThingInList);
  }

  checkError():void{
    console.log("CHECK ERROR");
    const arr: Array<any> = [this.myThings];
    const formGroup = new FormGroup({});
    this.errorService.checkError("things/mythings", this.messageComponent, formGroup, arr, "").subscribe(
      (actionNeeds)=>
        {
          this.hasCheckError = true;
          if (actionNeeds){
            this.getAllThingsUser();
          }
        }
    );
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

  onKeySearch(event: any) {
    console.log("ONKEYSEARCH");
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      //if (event.keyCode != 13) {
        $this.executeListing(event.target.value);
      //}
    }, 1000);
  }

  executeListing(value: string) {
    console.log("EXECUTELISTING");
    console.log("value = "+value);
    this.currentPage = 1;
    this.searchThingInList = value;
    this.userThings = [];
    let language = this.localStorageService.getLanguageApplication();
    this.updateMyThings(this.searchThingTypeInList, language, this.currentPage, this.statut, this.searchThingInList);
  }

  onKey(value:string) { 
    //this.selectedStates = this.search(value);
    //this.currentPage = 1;
    console.log("ONKEY CALLED");
    this.typeAllThings = of(this.searchType(value));
  }

  searchType(value: string) { 
    let filter = value.toLowerCase();
    return this.typeAllThingsArray.filter(option => option.name_fr.toLowerCase().startsWith(filter));
  }

  searchTypeThing(): void {
    this.getAllThingsUser();
	}

  totalPageData(totalPage:number){
    this.paginationComponent.setTotalItems(totalPage);
  }

  get paginateData() {
    const start = (this.currentPage -1)*10;
    const end = start + 10;

    this.myThings = of(this.userThings.slice(start,end));
    return this.currentPage;
  }
  
  changedPage(page: number){
    if(((page*10)-10)>this.totalThings) return;
    this.currentPage = page;
    this.getAllThingsUser();
  }

  stop(idThing:number){

  }
}

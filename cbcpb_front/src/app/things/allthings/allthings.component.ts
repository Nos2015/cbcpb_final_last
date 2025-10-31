import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { User } from '../../models/User';
import { Thing } from '../../models/Thing';
import { Observable, of } from 'rxjs';
import { ThingsService } from '../../services/things.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateappService } from 'src/app/services/translateapp.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Type } from 'src/app/models/Type';
import { TypethingService } from 'src/app/services/typething.service';
import { PaginationComponent } from 'src/app/pagination/pagination.component';

@Component({
    selector: 'app-allthings',
    templateUrl: './allthings.component.html',
    styleUrls: ['./allthings.component.scss'],
    standalone: false,
})
export class AllthingsComponent {
  @ViewChild(PaginationComponent) paginationComponent:PaginationComponent;
  allthings: Observable<Thing[]>;
  allthingsArrray: Array<Thing>= [];

  typeAllThings: Observable<Type[]>;
  typeAllThingsArray: Array<Type>= [];

  allThingsText = "";
  listAllThingsText = "";
  textSeeAllThings = "";
  textTitle = "";
  textStatus = "";
  textNothingThings = "";
  add = "";
  textCb = "";
  textCpb = "";
  nameThing = "";

  textType = "";
  allTypeThing = "";
  selected ="0";
  searchThingInList = "";
  textSearchTypeThing = "";
  searchLabel = "";
  timeout: any = null;

  totalThings = 0;
  totalSeeThings = 0;
  currentPage = 1;
  statut = "";

  fromAllSecondThings = "";


  private route = inject(ActivatedRoute);

  constructor(private authService: AuthService,
              private thingService: ThingsService,
              private typeThingService: TypethingService,
              private router: Router,
              public translate: TranslateappService,
              private elementRef: ElementRef,
              private localStorageService: LocalstorageService){
  }

  ngOnInit(): void{
    this.translate.comp$.subscribe(
      () => {
          this.modifyThingsText();
      }
    );
    this.modifyThingsText();
  }

  modifyThingsText(){
    let status = this.localStorageService.getLocalStorage("thingStatut");
    if(status != null){
      this.statut = status;
    }
    this.getAllThings();
    this.changeLanguage();
  }

  changeLanguage(){
    //if(this.elementRef.nativeElement.offsetParent != null) {
      this.translate.translate.get(
        [
          "things.allthings",
          "things.listallthings",
          "things.listgoodthings",
          "things.listidenticalthings",
          "things.listnotgoodthings",
          "things.textSeeAllThings",
          "things.textSeeAllGoodThings",
          "things.textSeeAllNotGoodThings",
          "things.textSeeAllIdenticalThings",
          "things.textTitle",
          "things.textStatus",
          "things.textNothingThings",
          "add",
          "things.textCb",
          "things.textCpb",
          "things.textType",
          "things.textSearchTypeThing",
          "good",
          "notgood",
          "header.research"
        ]
      )
      .subscribe(translations => {
        this.allThingsText = translations['things.allthings'];
        if(this.statut == "cb>cpb"){
          this.listAllThingsText = translations['things.listgoodthings'];
          this.textSeeAllThings = translations['things.textSeeAllGoodThings'];
          this.fromAllSecondThings = "things.listgoodthings";
        }
        else if (this.statut == "cb<cpb"){
          this.listAllThingsText = translations['things.listnotgoodthings'];
          this.textSeeAllThings = translations['things.textSeeAllNotGoodThings'];
          this.fromAllSecondThings = "things.listnotgoodthings";
        }
        else if (this.statut == "cb==cpb"){
          this.listAllThingsText = translations['things.listidenticalthings'];
          this.textSeeAllThings = translations['things.textSeeAllIdenticalThings'];
          this.fromAllSecondThings = "things.listidenticalthings";
        }
        else{
          this.listAllThingsText = translations['things.listallthings'];
          this.textSeeAllThings = translations['things.textSeeAllThings'];
          this.fromAllSecondThings = "things.listallthings";
        }
        
        this.textTitle = translations['things.textTitle'];
        this.textStatus = translations['things.textStatus'];
        this.textNothingThings = translations['things.textNothingThings'];
        this.add = translations["add"];
        this.textCb = translations['good'],
        this.textCpb = translations['notgood'],
        this.textType = translations['things.textType'];
        this.textSearchTypeThing = translations['things.textSearchTypeThing'];
        this.searchLabel = translations['header.research'];
      });
      let name = this.localStorageService.getLanguageApplication();
      if (name == null){
        this.nameThing = "";
      }
      else{
        this.nameThing = name;
      }
    //}
  }

  fetchCountAll(language:string):void{
    of(this.thingService.fetchAllCount(this.selected, this.statut, this.searchThingInList, language)).subscribe({
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

  updateAllTen(value:string, currentPage:number, statut:string, language:string, searchThingInList:string): void{
    of(this.thingService.fetchAll(value, language, currentPage, statut, searchThingInList)).subscribe({
        next: (v) => v.subscribe(
        {
          next:(v) => {
            if(v.message == "success" && v.things.length>0){
              let things = v.things as Array<any>;
              for (let i = 0; i < things.length; i++) {
                  let thing = things[i] as Thing;
                  if(thing.image == null || thing.image==""){
                    thing.image = "../assets/images_cb_cpb/no_image_notround.png";
                  }
                  this.allthingsArrray.push(thing);
              }
            }
            this.allthings = of(this.allthingsArrray);
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
  
  getAllThings():void {
    this.allthingsArrray = [];
    this.typeAllThingsArray = [];
    let language = this.localStorageService.getLanguageApplication();
    this.getTypeThings(language, this.selected);
    this.updateAllTen(this.selected, this.currentPage, this.statut, language, this.searchThingInList);
  }

  goToThing(thing: Thing, from: string, url: string){
    console.log("!!! go to thing allthings !!!");
    window.scroll(0,0);
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

  onKey(value:string) { 
    //this.selectedStates = this.search(value);
    //this.currentPage = 1;
    this.typeAllThings = of(this.searchType(value));
  }

  searchType(value: string) { 
    let filter = value.toLowerCase();
    return this.typeAllThingsArray.filter(option => option.name_fr.toLowerCase().startsWith(filter));
  }

  searchTypeThing(): void {
    this.getAllThings();
	}

  totalPageData(totalPage:number){
    this.paginationComponent.setTotalItems(totalPage);
  }

  get paginateData() {
    const start = (this.currentPage -1)*10;
    const end = start + 10;

    this.allthings = of(this.allthingsArrray.slice(start,end));
    return this.currentPage;
  }

  changedPage(page: number){
    if(((page*10)-10)>this.totalThings) return;
    this.currentPage = page;
    this.getAllThings();
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
    this.allthingsArrray = [];
    //let language = this.localStorageService.getLanguageApplication();
    console.log("this.selected = "+this.selected);
    this.onKey(this.selected);
    this.getAllThings();
    //this.updateAllTen(this.selected, this.currentPage, this.statut, language, this.searchThingInList);
  }
}

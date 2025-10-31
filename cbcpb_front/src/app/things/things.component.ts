import { Component, OnInit, ElementRef} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';
import { Thing } from '../models/Thing';
import { Observable, of } from 'rxjs';
import { ThingsService } from '../services/things.service';
import { Router } from '@angular/router';
import { TranslateappService } from '../services/translateapp.service';
import { LocalstorageService } from '../services/localstorage.service';

@Component({
    selector: 'app-things',
    templateUrl: './things.component.html',
    styleUrls: ['./things.component.scss'],
    standalone: false
})
export class ThingsComponent implements OnInit{

  things: Observable<Thing[]>;
  thingsArray: Array<Thing>= [];

  thingsGood: Observable<Thing[]>;
  thingsGoodArray: Array<Thing>= [];

  thingsNotGood: Observable<Thing[]>;
  thingsNotGoodArray: Array<Thing>= [];

  thingsEqual: Observable<Thing[]>;
  thingsEqualArray: Array<Thing>= [];

  userId: Pick<User, "id">;

  allThingsText = "";
  listAllThingsText = "";
  listAllGoodThingsText = "";
  listAllNotGoodThingsText = "";
  listAllIdenticalThingsText = "";
  textPresentThings = "";
  textThingIs = "";
  textThingGoodExplain = "";
  textThingNotGoodExplain= "";
  textThingIdenticalExplain = "";
  textLastTenThings = "";
  textLastTenGoodThings = "";
  textLastTenNotGoodThings = "";
  textLastTenIdenticalThings = "";
  textTitle = "";
  textStatus = "";
  textSeeAllList = "";
  textAdd = "";
  textNothingThings = "";
  textNothingGoodThings = "";
  textNothingNotGoodThings = "";
  textNothingIdenticalThings = "";
  nameThing = "";
  textCb = "";
  textCpb = "";

  typeId = "0";
  statut = "";
  currentPage = 1;
  url = "/things/allthings";

  constructor(private authService: AuthService,
              private thingService: ThingsService,
              private router: Router,
              public translate: TranslateappService,
              private elementRef: ElementRef,
              private localStorageService: LocalstorageService){
  }

  changeLanguage(){
    //if(this.elementRef.nativeElement.offsetParent != null) {
      this.translate.translate.get(
        [
          "things.allthings",
          "things.listallthings",
          "things.listgoodthings",
          "things.listnotgoodthings",
          "things.listidenticalthings",
          "things.textPresentThings",
          "things.textThingIs",
          "things.textThingGoodExplain",
          "things.textThingNotGoodExplain",
          "things.textThingIdenticalExplain",
          "things.textLastTenThings",
          "things.textLastTenGoodThings",
          "things.textLastTenNotGoodThings",
          "things.textLastTenIdenticalThings",
          "things.textTitle",
          "things.textStatus",
          "seeAllList",
          "add",
          "things.textNothingThings",
          "things.textNothingGoodThings",
          "things.textNothingNotGoodThings",
          "things.textNothingIdenticalThings",
          "things.textCb",
          "things.textCpb",
          "good",
          "notgood"
        ]
      )
      .subscribe(translations => {
        this.allThingsText = translations['things.allthings'];
        this.listAllThingsText = translations['things.listallthings'];
        this.listAllGoodThingsText = translations['things.listgoodthings'];
        this.listAllNotGoodThingsText = translations['things.listnotgoodthings'];
        this.listAllIdenticalThingsText = translations['things.listidenticalthings'];
        this.textPresentThings = translations['things.textPresentThings'];
        this.textThingIs = translations['things.textThingIs'];
        this.textThingGoodExplain = translations['things.textThingGoodExplain'];
        this.textThingNotGoodExplain = translations['things.textThingNotGoodExplain'];
        this.textThingIdenticalExplain = translations['things.textThingIdenticalExplain'];
        this.textLastTenThings = translations['things.textLastTenThings'];
        this.textLastTenGoodThings = translations['things.textLastTenGoodThings'];
        this.textLastTenNotGoodThings = translations['things.textLastTenNotGoodThings'];
        this.textLastTenIdenticalThings = translations['things.textLastTenIdenticalThings'];
        this.textTitle = translations['things.textTitle'];
        this.textStatus = translations['things.textStatus'];
        this.textSeeAllList = translations['seeAllList'];
        this.textAdd = translations['add'];
        this.textNothingThings = translations['things.textNothingThings'],
        this.textNothingGoodThings = translations['things.textNothingGoodThings'],
        this.textNothingNotGoodThings = translations['things.textNothingNotGoodThings'],
        this.textNothingIdenticalThings = translations['things.textNothingIdenticalThings'],
        this.textCb = translations['good'],
        this.textCpb = translations['notgood']
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

  ngOnInit(): void{
    console.log("YOUHOU IN THINGS")
    this.translate.comp$.subscribe(
      () => {
          console.log("change language things");
          this.changeLanguage();
      }
    );
    this.changeLanguage();
    this.getAllThings();
  }

  fetchAllTen(things_id:string, currentPage:number, statut:string): void{
    let language = this.localStorageService.getLanguageApplication();
    of(this.thingService.fetchAll(things_id, language, currentPage, statut,"")).subscribe({
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
                  if(statut == ""){
                    this.thingsArray.push(thing);
                  }
                  else if (statut == "cb>cpb"){
                    this.thingsGoodArray.push(thing);
                  }
                  else if (statut == "cb<cpb"){
                    this.thingsNotGoodArray.push(thing);
                  }
                  else if (statut == "cb==cpb"){
                    this.thingsEqualArray.push(thing);
                  }
              }
            }
            if(statut == ""){
              this.things = of(this.thingsArray);
            }
            else if (statut == "cb>cpb"){
              this.thingsGood = of(this.thingsGoodArray);
            }
            else if (statut == "cb<cpb"){
              this.thingsNotGood = of(this.thingsNotGoodArray);
            }
            else if (statut == "cb==cpb"){
              this.thingsEqual = of(this.thingsEqualArray);
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

  getAllThings():void{
    this.thingsArray = [];
    this.updateThings();
  }

  updateThings():void{
    console.log("updateThings");
    this.fetchAllTen(this.typeId,this.currentPage,this.statut);
    this.statut = "cb>cpb";
    this.fetchAllTen(this.typeId,this.currentPage,this.statut);
    this.statut = "cb<cpb";
    this.fetchAllTen(this.typeId,this.currentPage,this.statut);
    this.statut = "cb==cpb";
    this.fetchAllTen(this.typeId,this.currentPage,this.statut);
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

  goTo(status: string): void{
    window.scroll(0,0);
    this.setStatus(status);
    this.router.navigate(['things/allthings']);
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
}

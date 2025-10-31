import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Thing } from 'src/app/models/Thing';
import { Country } from 'src/app/models/Country'
import { Router } from '@angular/router';
import { TranslateappService } from 'src/app/services/translateapp.service';
import { Observable, of, from } from 'rxjs';
import { CountryService } from 'src/app/services/country.service';
import { ContinentService } from 'src/app/services/continent.service';
import { VotethingService } from 'src/app/services/votething.service';
import { Votething } from 'src/app/models/Votething';
import { Continent } from 'src/app/models/Continent';
import { FormGroup } from '@angular/forms';
import { ErrorService } from 'src/app/services/error.service';
import { MessageComponent } from 'src/app/message/message.component';
import { AuthService } from 'src/app/services/auth.service';
import { ThingsService } from 'src/app/services/things.service';
import { GoogleGenAI } from '@google/genai';

@Component({
    selector: 'app-thing',
    templateUrl: './thing.component.html',
    styleUrls: ['./thing.component.scss'],
    standalone: false
})

export class ThingComponent implements OnInit{
  public thing: Thing;
  thingCb = "";
  thingCpb = "";

  public country: Observable<Country[]>;
  countries: Country[];
  fetchAllCountries = false;

  public continent: Observable<Continent[]>;

  voteContinent: Observable<Votething[]>;
  voteNotContinent: Observable<Votething[]>;

  voteCountry: Observable<{
      thingsCount: number;
      message: String
  }>;
  
  voteNotCountry: Observable<{
      thingsCount: number;
      message: String
  }>

  allThingsText = "";
  secondThingLinkTextInTranslations = "";
  secondThingLinkText = "";
  secondThingLinkUrlText = "";
  voteText="";
  resultsText="";
  byContinentText="";
  byCountryText="";
  byRegionText="";
  byCityText="";
  continentText = "";
  countryText ="";
  textStatus = "";
  langText = "";
  textgood = "";
  textnotgood  = "";
  textequal = "";
  textclick = "";
  textbelow = "";
  textThingIsScore = "";
  textThingAllOverTheWorld = "";
  textThingYouCan = "";
  textThingInAnyCase = "";
  textThingOrAlwaysNotGood = "";
  textThingOrAlwaysGood = "";
  textThingPossibility = "";
  textThingSeeOtherVotes = "";
  textThingInterestingAfterAll = "";
  textThingIA = "";
  textGoodOrNotGood = "";
  textWaitIA = "";
  textResponseIA = "";
  textThatsGoodOrNot = "";
  textWeVote = "";
  textSoWe = "";
  textNoVote = "";

  textAll = "";
  searchLabel = "";
  searchOption = "";
  noContinentForSearch = "";
  noCountryForSearch = "";

  searchContinent = "";
  noSearchContinent = true;
  searchCountry = "";
  noSearchCountry = true;

  votesGoodContinent = new Array();
  votesNotGoodContinent = new Array();
  votesByContinentStatus = new Array();
  selectedContinent = 0;
  searchResultContinent = 0;

  votesGoodCountry = new Array();
  votesNotGoodCountry = new Array();
  votesByCountryStatus = new Array();
  selectedCountry = 0;
  searchResultCountry = 0;

  updateLanguageFirst = true;

  private exist:boolean = true;

  hasCheckError:boolean = false;

  promptIA?: string;
  stringsIAToBeTyped: string[] = [];

  @ViewChild(MessageComponent) messageComponent: any;
  @ViewChildren('MessageComponent')
  public MessageComponents: QueryList<MessageComponent>;

  alreadyIA = false;

  constructor(private router: Router,
              public translate: TranslateappService,
              private countryService: CountryService,
              private voteThingService: VotethingService,
              private continentService:ContinentService,
              private elementRef: ElementRef,
              private errorService: ErrorService,
              private authService: AuthService,
              private thingService: ThingsService){
  }

  ngOnInit(): void {
    this.exist = true;
    
    let recupThing = history.state.thing;
    if (recupThing == undefined){
      console.log("recupThing undefined");
      /*let idThing = localStorage.getItem("currentThing");
      if (idThing !== null){
        from(this.thingService.fetchThing(+idThing)).forEach(element=>{
          of(element).subscribe({
            next: (v) => v.subscribe({
              next:(el) => {
                this.thing = el[0];
                let secondThing = localStorage.getItem("secondThingLinkUrlText");
                if(secondThing != null){
                  this.secondThingLinkText = secondThing;
                }
                let secondThingUrlText = localStorage.getItem("secondThingLinkUrl");
                if(secondThingUrlText != null){
                  this.secondThingLinkUrlText = secondThingUrlText;
                }
              },
              error: (e) => console.error(e),
              complete: () => console.info('complete')
            }),
            error: (e) => console.error(e),
            complete: () => console.info('complete')
          })
        });
      }
      else{
        window.scroll(0,0);
        this.router.navigate(['']);
      }*/
      window.scroll(0,0);
      this.router.navigate(['']);
    }
    else{
      this.thing = recupThing;
      let secondLinkThingText = localStorage.getItem("secondThingLinkUrlText");
      if(secondLinkThingText != null){
        this.secondThingLinkText = secondLinkThingText;
      }
      this.secondThingLinkUrlText = history.state.url;
    }

    this.translate.comp$.subscribe(
      () => {
          this.changeLanguage();
          this.visibleThingCbCpb();
      }
    );
    this.changeLanguage();
    this.visibleThingCbCpb();
  }

  getNumberToDisplay(element:number):string{
    var elementString = element.toString();
    switch (elementString.length){
        case 0:
        case 1:
        case 2:
        case 3:
        break;
        case 4:
          var firstChar = elementString[0];
          var lastChar = elementString[1] + elementString[2] + elementString[3];
          elementString = firstChar + " " + lastChar;
        break;
        case 5:
          var firstChar = elementString[0] + elementString[1];
          var lastChar = elementString[2] + elementString[3] + elementString[4];
          elementString = firstChar + " " + lastChar;
        break;
        case 6:
          var firstChar = elementString[0] +elementString[1] + elementString[2];
          var lastChar = elementString[3] + elementString[4] + elementString[5];
          elementString = firstChar + " " + lastChar;
        break;
        case 7:
          var firstChar = elementString[0];
          var secondChar = elementString[1] + elementString[2] + elementString[3];
          var lastChar = elementString[4] + elementString[5] + elementString[6];
          elementString = firstChar + " " + secondChar + " " + lastChar;
        break;
        case 8:
          var firstChar = elementString[0] + elementString[1];
          var secondChar = elementString[2] + elementString[3] + elementString[4];
          var lastChar = elementString[5] + elementString[6] + elementString[7];
          elementString = firstChar + " " + secondChar + " " + lastChar;
        break;
        case 9:
          var firstChar = elementString[0] + elementString[1] + elementString[2];
          var secondChar = elementString[3] + elementString[4] + elementString[5];
          var lastChar = elementString[6] + elementString[7] + elementString[8];
          elementString = firstChar + " " + secondChar + " " + lastChar;
        break;
        case 10:
          var firstChar = elementString[0];
          var secondChar = elementString[1] + elementString[2] + elementString[3];
          var thirddChar = elementString[4] + elementString[5] + elementString[6];
          var lastChar = elementString[7] + elementString[8] + elementString[9];
          elementString = firstChar + " " + secondChar + " " + thirddChar + " " + lastChar;
        break;
      }
      return elementString;
  }

  visibleThingCbCpb(){
    if(this.thing != undefined || this.thing != null){
      this.thingCb = this.getNumberToDisplay(this.thing.cb);
      this.thingCpb = this.getNumberToDisplay(this.thing.cpb);
    }
  }

  async updateLanguage(language:string){
      this.langText = language;
      this.translate.translate.get(
        [
          "header.research",
          "things.allthings",
          "things.listallthings",
          "things.listgoodthings",
          "things.listnotgoodthings",
          "things.listidenticalthings",
          "things.listmythings",
          "things.textStatus",
          "things.textThingNotResearchContinent",
          "things.textThingNotResearchCountry",
          "things.textThingIsScore",
          "things.textThingAllOverTheWorld",
          "things.textThingYouCan",
          "things.textThingInAnyCase",
          "things.textThingOrAlwaysNotGood",
          "things.textThingOrAlwaysGood",
          "things.textThingPossibility",
          "things.textThingSeeOtherVotes",
          "things.textThingInterestingAfterAll",
          "things.textThingIA",
          "things.textWaitIA",
          "things.textResponseIA",
          "things.textThatsGoodOrNot",
          "things.textSoWe",
          "things.textNoVote",
          "vote",
          "weVote",
          "results",
          "byContinent",
          "byCountry",
          "byRegion",
          "byCity",
          "country",
          "good",
          "notgood",
          "equal",
          "continent",
          "all",
          "search",
          "click",
          "below"
        ]
      )
      .subscribe(async translations => {
        this.noSearchContinent = true;
        this.searchContinent = "";
        this.noSearchCountry = true;
        this.searchCountry = "";
        this.searchLabel = translations['header.research'];
        this.allThingsText = translations['things.allthings'];
        if(history.state.from != undefined){
          localStorage.setItem("secondThingLinkFromText",history.state.from);
          this.secondThingLinkTextInTranslations = translations[history.state.from];
          this.secondThingLinkText = translations[history.state.from];
        }
        else{
          let secondThingLinkFromText = localStorage.getItem("secondThingLinkFromText");
          if ( secondThingLinkFromText != undefined){
            this.secondThingLinkTextInTranslations = translations[secondThingLinkFromText];
            this.secondThingLinkText = translations[secondThingLinkFromText];
          }
        }
        this.voteText = translations["vote"];
        this.textWeVote = translations["weVote"];
        this.resultsText = translations["results"];
        this.byContinentText = translations["byContinent"];
        this.byCountryText = translations["byCountry"];
        this.byRegionText = translations["byRegion"];
        this.byCityText = translations["byCity"];
        this.countryText = translations["country"];
        this.continentText = translations["continent"];
        this.textStatus = translations["things.textStatus"];
        this.textgood = translations["good"];
        this.textnotgood = translations["notgood"];
        this.textequal = translations["equal"];
        this.textAll = translations["all"];
        this.searchOption = translations["search"];
        this.noContinentForSearch = translations["things.textThingNotResearchContinent"];
        this.noCountryForSearch = translations["things.textThingNotResearchCountry"];

        this.textclick = translations["click"];
        this.textbelow = translations["below"];
        this.textThingIsScore = translations["things.textThingIsScore"];
        this.textThingAllOverTheWorld = translations["things.textThingAllOverTheWorld"];
        this.textThingYouCan = translations["things.textThingYouCan"];
        this.textThingInAnyCase = translations["things.textThingInAnyCase"];
        this.textThingOrAlwaysNotGood = translations["things.textThingOrAlwaysNotGood"];
        this.textThingOrAlwaysGood = translations["things.textThingOrAlwaysGood"];
        this.textThingPossibility = translations["things.textThingPossibility"];
        this.textThingSeeOtherVotes = translations["things.textThingSeeOtherVotes"];
        this.textThingInterestingAfterAll = translations["things.textThingInterestingAfterAll"];
        this.textThingIA = translations["things.textThingIA"];
        this.textWaitIA = translations["things.textWaitIA"];
        this.textResponseIA = translations["things.textResponseIA"];
        this.textThatsGoodOrNot = translations["things.textThatsGoodOrNot"];
        this.textSoWe = translations["things.textSoWe"];
        this.textNoVote = translations["things.textNoVote"];
        
        if(this.thing.cb>this.thing.cpb){
          this.textGoodOrNotGood = this.textgood;
        }
        else if(this.thing.cb<this.thing.cpb){
          this.textGoodOrNotGood = this.textnotgood;
        }
        else{
          this.textGoodOrNotGood = this.textequal;
        }

        if(this.exist){
          /*Country*/
          this.fetchAllCountry(this.translate.translate.currentLang, this.thing.id);

          /*Continents*/
          this.fetchAllContinent(this.translate.translate.currentLang, this.thing.id);
        }
      });
  }

  checkError():void{
    const arr: Array<any> = [this.thing];
    const formGroup = new FormGroup({});
    this.errorService.checkError("things/detailthing", this.messageComponent, formGroup, arr, "").subscribe(
      (actionNeeds)=>
        {
          this.hasCheckError = true;
          if (actionNeeds){

          }
        }
    );
  }

  launchUpdateLanguage(){
    if(this.elementRef.nativeElement.offsetParent != null) {
        this.updateLanguageFirst = false;
        this.updateLanguage(this.translate.translate.currentLang);
    }
  }

  changeLanguage(){

    if (!this.hasCheckError){
      this.checkError();
    }

    this.launchUpdateLanguage();
  }

  vote():void{
    if(this.authService.isLoggedIn()){
      const state = {
        state:{
          thing:this.thing,
          from: this.secondThingLinkTextInTranslations,
          url: this.secondThingLinkUrlText
        }
      }
      console.log("GO TO things/allthings/detailthing/vote");
      this.goTo("things/allthings/detailthing/vote", state);
    }
    else{
      localStorage.setItem("currentThing", this.thing.id.toString());
      localStorage.setItem("secondThingLinkUrl",this.secondThingLinkUrlText);
      localStorage.setItem("secondThingLinkFromText", this.secondThingLinkTextInTranslations);
      localStorage.setItem("secondThingLinkUrlText", this.secondThingLinkText);
      localStorage.setItem("errorOperationMessage","vote");
      localStorage.setItem("fromUrl", "things/allthings/detailthing/vote");
      this.goTo("/login", null);
    }
  }

  goTo(url: string, state:any): void{
    window.scroll(0,0);
    localStorage.setItem("fromUrl", "things/allthings/detailthing/vote");
    if (state != null){
      this.router.navigate([url],state);
    }
    else{
      this.router.navigateByUrl(url);
    }
  }

  fetchAllCountry(lang:string, idThing:number): void{
    of(this.countryService.fetchAllWithThing(lang, idThing)).subscribe({
        next: (v) => v.subscribe(
        {
          next:(v) => {
            if(v.message == "success" && v.countries.length>0){
              let countries = v.countries as Array<any>;
              for (let i = 0; i < countries.length; i++) {
                  let country = countries[i] as Country;
                  if(country.image == null || country.image==""){
                    country.image = "../assets/images_cb_cpb/no_image_notround.png";
                  }
              }
              this.country = of(countries);
              this.countries = countries;
            }
          },
          error: (e) => console.error(e),
          complete: () => {
            this.fetchAllCountries = true;
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

  fetchAllContinent(lang: string, idThing:number): void{
    of(this.continentService.fetchAllWithThing(lang, idThing)).subscribe({
        next: (v) => v.subscribe(
        {
          next:(v) => {
            if(v.message == "success" && v.continents.length>0){
              let continents = v.continents as Array<any>;
              for (let i = 0; i < continents.length; i++) {
                  let continent = continents[i] as Country;
                  if(continent.image == null || continent.image==""){
                    continent.image = "../assets/images_cb_cpb/no_image.png";
                  }
              }
              this.continent = of(continents);
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

  addNoneContinent():Continent{
    return this.continentService.addNone();
  }

  insertIconStatus(good:number,notgood:number):string{
    var status = "";
    if (good == notgood){
      status = 'assets/equal.png'
    }
    else if (good > notgood){
      status = 'assets/thatsgood.png';
    }
    else{
      status = 'assets/thatsnotgood.png';
    }
    return status;
  }

  onContinentChange(select:number) {
    if (select != 1){
      this.noSearchContinent = true;
      this.searchContinent = "";
      var elementDisplay = 0;
      const list = Array.from(document.getElementsByClassName('mat-list-items-continent') as HTMLCollectionOf<HTMLElement>);
      list.forEach((element) => {
        if(this.selectedContinent == 0){
          element.style.display="inline-block";
          elementDisplay++;
        }
        else{
          if (element.classList.contains("mat-list-items-continent-"+this.selectedContinent)){
            element.style.display="inline-block";
            elementDisplay++;
          }
          else{
            element.style.display="none";
          }
        }
      });
      this.searchResultContinent = elementDisplay;
    }
  }

  onCountryChange(select:number) {
    if (select != 1){
      this.noSearchCountry = true;
      this.searchCountry = "";
      var elementDisplay = 0;
      const list = Array.from(document.getElementsByClassName('mat-list-items-country') as HTMLCollectionOf<HTMLElement>);
      list.forEach((element) => {
        if(this.selectedCountry == 0){
          element.style.display="inline-block";
          elementDisplay++;
        }
        else{
          if (element.classList.contains("mat-list-items-country-"+this.selectedCountry)){
            element.style.display="inline-block";
            elementDisplay++;
          }
          else{
            element.style.display="none";
          }
        }
      });
      this.searchResultCountry = elementDisplay;
    }
  }

  changeInputSearchContinent(search:string){
    /*Search without uppercase, accent & whitespace */
    if (search !=""){
      this.noSearchContinent = false;
    }
    else{
      this.noSearchContinent = true;
    }
    const search_normalize = search.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g,'').replace(/- /g,'');
    from(this.continent).forEach(continentElement=>{
      this.searchResultContinent = continentElement.length;
      var searchMoins = 0;
      continentElement.forEach(element=>{
        if (this.langText == "en"){
          if (element.lowercase_name.includes(search_normalize)){
            const list = Array.from(document.getElementsByClassName('mat-list-items-continent-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="inline-block";
            });
          }
          else{
            const list = Array.from(document.getElementsByClassName('mat-list-items-continent-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="none";
              searchMoins++;
            });
          }
        }
        else{
          if (element.lowercase_namefr.includes(search_normalize)){
            const list = Array.from(document.getElementsByClassName('mat-list-items-continent-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="inline-block";
            });
          }
          else{
            const list = Array.from(document.getElementsByClassName('mat-list-items-continent-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="none";
              searchMoins++;
            });
          }
        }

      });
      this.searchResultContinent = this.searchResultContinent-searchMoins;
    });
  }

  changeInputSearchCountry(search:string){
    if (search !=""){
      this.noSearchCountry = false;
    }
    else{
      this.noSearchCountry = true;
    }
    /*Search without uppercase, accent & whitespace */
    const search_normalize = search.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g,'').replace(/- /g,'').replace(/' /g,'');
    this.country.forEach(countryElement=>{
      this.searchResultCountry = countryElement.length;
      var searchMoins = 0;
      countryElement.forEach(element=>{
        if (this.langText == "en"){
          if (element.lowercase_name.includes(search_normalize)){
            const list = Array.from(document.getElementsByClassName('mat-list-items-country-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="inline-block";
            });
          }
          else{
            const list = Array.from(document.getElementsByClassName('mat-list-items-country-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="none";
              searchMoins++;
            });
          }
        }
        else{
          if (element.lowercase_nameFr.includes(search_normalize)){
            const list = Array.from(document.getElementsByClassName('mat-list-items-country-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="inline-block";
            });
          }
          else{
            const list = Array.from(document.getElementsByClassName('mat-list-items-country-'+element.id) as HTMLCollectionOf<HTMLElement>);
            list.forEach((cont) => {
              cont.style.display="none";
              searchMoins++;
            });
          }
        }

      });
      this.searchResultCountry = this.searchResultCountry - searchMoins
    });
  }

  async getIA(){
    if(!this.alreadyIA){
      this.promptIA = this.textThatsGoodOrNot + this.thing.name + " ?";
      const ai = new GoogleGenAI({ apiKey: "AIzaSyCs22qpiUzHS7-XRNDWtKDmN0vJv1hqNJo"});
      const responseIA = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: this.promptIA,
      });
      if(responseIA != undefined){
        let responsestring = responseIA.text
        if(responsestring != undefined){
          this.stringsIAToBeTyped = [responsestring];
        } 
      }
    }
  }

  iaCompleted(){
    this.alreadyIA = true;
  }

  ngOnDestroy(): void {
    if (this.thing != undefined){
      localStorage.setItem("currentThing", this.thing.id.toString());
      localStorage.setItem("secondThingLinkUrl",this.secondThingLinkUrlText);
      localStorage.setItem("secondThingLinkFromText", this.secondThingLinkTextInTranslations);
      localStorage.setItem("secondThingLinkUrlText", this.secondThingLinkText);
    }
    this.exist = false;
  }
}

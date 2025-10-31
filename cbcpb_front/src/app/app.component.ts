import { Component } from '@angular/core';
import DataJson from '../assets/data.json';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, pairwise, startWith } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {

  title = 'cbcpb';
  sidebarActive = false;
  data : any;
  previousUrl: string = "";
  currentUrl: string = "";
  isUpdate = false;

  constructor(private router: Router,
    ){
      if(!this.isUpdate){
        this.data = DataJson;
      }
  }

  ngOnInit() {
    if(!this.isUpdate){
      this.router.events
      .pipe(
        filter((x) => x instanceof NavigationEnd),
        startWith(null),
        map((x) => x && x.url),
        pairwise()
      )
      .subscribe((event) => {
        this.previousUrl = event[0]!=null?event[0]:"";
        this.currentUrl = event[1]!=null?event[1]:"";
      });
    }
  }

  chooseElementOnSideBar($event:boolean){
    this.sidebarActive = $event;
  }
}

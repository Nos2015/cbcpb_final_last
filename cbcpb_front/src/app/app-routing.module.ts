import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResultsComponent } from './results/results.component';
import { ThingsComponent } from './things/things.component';
import { CreateThingComponent } from './create-thing/create-thing.component';
import { AllthingsComponent } from './things/allthings/allthings.component';
import { ThingComponent } from './things/thing/thing.component';
import { UserComponent } from './users/user/user.component';
import { AdminComponent } from './admin/admin.component';
import { ValiduserComponent } from './validuser/validuser.component';
import { MythingsComponent } from './things/mythings/mythings.component';
import { VoteComponent } from './things/thing/vote/vote.component';

const routes: Routes = [
  { path:"", component:HomeComponent },
  { path:"login", component:LoginComponent },
  { path:"profil", component:UserComponent },
  { path:"signup", component:SignupComponent },
  { path:"things", component:ThingsComponent},
  { path:"things/allthings", component:AllthingsComponent},
  { path:"things/mythings", component:MythingsComponent},
  { path:"things/allthings/detailthing", component:ThingComponent},
  { path:"things/allthings/detailthing/vote", component:VoteComponent},
  //{ path:"create-things", component:CreateThingComponent, canActivate: [AuthGuardService]},
  { path:"create-things", component:CreateThingComponent},
  { path:"admin", component:AdminComponent},
  { path:"results", component:ResultsComponent },
  { path:"code", component:ValiduserComponent },
  { path:"**", redirectTo: ""},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SignupComponent } from './signup/signup.component';
import { ResultsComponent } from './results/results.component';
import { ThingsComponent } from './things/things.component';
import { CreateThingComponent } from './create-thing/create-thing.component';

import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AllthingsComponent } from './things/allthings/allthings.component';
import { ThingComponent } from './things/thing/thing.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateappService } from './services/translateapp.service';
import { UserComponent } from './users/user/user.component';
import { ErrormessageComponent } from './errormessage/errormessage.component';
import { AdminComponent } from './admin/admin.component';
import { ValiduserComponent } from './validuser/validuser.component';

import { CodeInputModule } from 'angular-code-input';
import { LinkComponent } from './link/link.component';
import { MessageComponent } from './message/message.component';
import { PopupWindowComponent } from './popup-window/popup-window.component';
import { MythingsComponent } from './things/mythings/mythings.component';
import { VoteComponent } from './things/thing/vote/vote.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeValidatePopupComponent } from './shared/code-validate-popup/code-validate-popup.component';
import { ScrollingCardComponent } from './shared/scrolling-card/scrolling-card.component';
import { PaginationComponent } from "src/app/pagination/pagination.component";
import { IMAGE_CONFIG, NgOptimizedImage } from '@angular/common'
import { NgxTypedJsModule } from 'ngx-typed-js';
import { UpdateComponent } from "./update/update.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({ declarations: [
        AppComponent,
        UpdateComponent,
        SideBarComponent,
        PaginationComponent,
        HeaderComponent,
        HomeComponent,
        FooterComponent,
        LoginComponent,
        SignupComponent,
        ResultsComponent,
        ThingsComponent,
        CreateThingComponent,
        AllthingsComponent,
        ThingComponent,
        UserComponent,
        ErrormessageComponent,
        AdminComponent,
        ValiduserComponent,
        LinkComponent,
        MessageComponent,
        MythingsComponent,
        VoteComponent,
        CodeValidatePopupComponent,
        ScrollingCardComponent
    ],
    bootstrap: [AppComponent], imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxTypedJsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule,
    NgOptimizedImage,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    CodeInputModule.forRoot({
        codeLength: 6,
        isCharsCode: false,
        code: '12345'
    }),
    PopupWindowComponent,
    NgbModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        },
        {
            provide: IMAGE_CONFIG,
            useValue: {
            disableImageSizeWarning: true, 
            disableImageLazyLoadWarning: true
            }
        },
        TranslateappService,
        ErrormessageComponent,
        MessageComponent,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

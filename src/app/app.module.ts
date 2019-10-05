import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { ApolloModule } from "apollo-angular";
import { HttpLinkModule } from "apollo-angular-link-http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { GraphQLModule } from "./graphql.module";

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent],
  imports: [
    HttpLinkModule,
    BrowserModule,
    AppRoutingModule,
    ApolloModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    GraphQLModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule {}

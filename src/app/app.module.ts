import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";

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
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({ uri: "https://graph.becode.xyz/" });

    const authLink = new ApolloLink((operation, forward) => {
      const token = localStorage.getItem("token");

      operation.setContext({
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoia2V5IiwidWlkIjoiZjc2NzA2NjItYjlkOC00NDA3LWI5MTQtZmUzOGZhZGVmZjA5Iiwia2V5IjoiMzRiMDFhNTYiLCJpYXQiOjE1Njk5MTQxNjB9.lyFUBYqnrG22eOrw2mkfPhFv7mShw6cw-X7bziN491Y"
        }
      });

      return forward(operation);
    });

    apollo.create({
      link: authLink.concat(http),
      cache: new InMemoryCache()
    });
  }
}

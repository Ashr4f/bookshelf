import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloLink } from "apollo-link";
import { HttpLink, HttpLinkModule } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const uri = "https://graph.becode.xyz";
    const http = httpLink.create({ uri });

    const authLink = new ApolloLink((operation, forward) => {
      const token = localStorage.getItem("token");

      operation.setContext({
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoia2V5IiwidWlkIjoiZjc2NzA2NjItYjlkOC00NDA3LWI5MTQtZmUzOGZhZGVmZjA5Iiwia2V5IjoiMzRiMDFhNTYiLCJpYXQiOjE1Njk5MTQxNjB9.lyFUBYqnrG22eOrw2mkfPhFv7mShw6cw-X7bziN491Y"
        },
        cors: true
      });

      return forward(operation);
    });

    apollo.create({
      link: authLink.concat(http),
      cache: new InMemoryCache()
    });
  }
}

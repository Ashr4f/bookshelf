import { NgModule } from "@angular/core";
import { Apollo, ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import { ApolloLink } from "apollo-link";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const uri = "https://graph.becode.xyz/";
export function createApollo(httpLink: HttpLink) {
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
  return {
    link: authLink.concat(http),
    cache: new InMemoryCache()
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}

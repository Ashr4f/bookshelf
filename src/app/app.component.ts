import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "bookshelf";
  constructor(apollo: Apollo) {
    apollo
      .query({
        query: gql`
          {
            books(all: true) {
              nodes {
                title
              }
            }
          }
        `
      })
      .subscribe(console.log);
  }
}

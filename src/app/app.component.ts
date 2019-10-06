import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { ALL_BOOKS_QUERY, AllBooksQueryResponse } from "./graphql";

type Book = {
  nodes: any;
};

type Response = {
  books: Book;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "bookshelf";
  constructor(apollo: Apollo) {
    apollo
      .watchQuery<Response>({
        query: ALL_BOOKS_QUERY
      })
      .valueChanges.subscribe(result => {
        console.log(result.data.books.nodes);
      });
  }
}

import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

const BOOK_QUERY = gql`
  {
    books(all: true) {
      nodes {
        title
        author
      }
    }
  }
`;

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
        query: BOOK_QUERY
      })
      .valueChanges.subscribe(result => {
        console.log(result.data.books.nodes);
      });
  }
}

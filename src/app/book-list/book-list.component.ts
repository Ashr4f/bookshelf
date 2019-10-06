import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Book } from "../types";
import { ALL_BOOKS_QUERY, AllBooksQueryResponse } from "../graphql";

type Response = {
  books: any;
  loading: boolean;
};

@Component({
  selector: "hn-book-list",
  templateUrl: "./book-list.component.html",
  styleUrls: ["./book-list.component.scss"]
})
export class BookListComponent implements OnInit {
  allBooks: Book[] = [];
  loading: boolean = true;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<Response>({
        query: ALL_BOOKS_QUERY
      })
      .valueChanges.subscribe(response => {
        this.allBooks = response.data.books.nodes;
        this.loading = response.data.loading;
      });
  }
}

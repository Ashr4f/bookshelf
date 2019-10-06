import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Book } from "../types";

// 1
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
  // 2
  allBooks: Book[] = [];
  loading: boolean = true;

  // 3
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    // 4
    this.apollo
      .watchQuery<Response>({
        query: ALL_BOOKS_QUERY
      })
      .valueChanges.subscribe(response => {
        // 5
        this.allBooks = response.data.books.nodes;

        this.loading = response.data.loading;
      });
  }
}

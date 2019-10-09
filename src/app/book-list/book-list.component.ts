import { Component, OnInit } from "@angular/core";
import { Book } from "../types";
import { QueriesService } from "src/app/services/gql-queries.service";

@Component({
  selector: "hn-book-list",
  templateUrl: "./book-list.component.html",
  styleUrls: ["./book-list.component.scss"]
})
export class BookListComponent implements OnInit {
  allBooks: Book[] = [];
  loading: boolean = true;
  tooltips = ["terrible", "bad", "normal", "good", "wonderful"];
  bookReview: number;

  constructor(private gqlQueries: QueriesService) {}

  ngOnInit() {
    this.gqlQueries.getAllBooks().then((booksData: any) => {
      this.loading = booksData.loading;
      this.allBooks = booksData.data.books.nodes;
      console.log(booksData);
    });
  }
}

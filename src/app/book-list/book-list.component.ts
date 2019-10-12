import { Component, OnInit } from "@angular/core";
import { Book } from "../types";
import { QueriesService } from "src/app/services/gql-queries.service";

@Component({
  selector: "hn-book-list",
  templateUrl: "./book-list.component.html",
  styleUrls: ["./book-list.component.scss"]
})
export class BookListComponent implements OnInit {
  allBooks: any[any] = [];
  loading: boolean = true;
  tooltips = ["terrible", "bad", "normal", "good", "wonderful"];
  booksReviews: number[] = [];
  reviewersTotalCount: number;
  allNotes: any[] = [];
  allBookAvailabilities: any[] = [];

  constructor(private gqlQueries: QueriesService) {}

  ngOnInit() {
    this.gqlQueries.getAllBooks().then((booksData: any) => {
      this.loading = booksData.loading;
      this.allBooks = booksData.data.books.nodes;

      for (let i = 0; i < this.allBooks.length; i++) {
        this.allNotes[i] = this.allBooks[i].reviews.nodes;
      }

      this.allBooks.forEach((book: any) => {
        let currentBookAvailabilities: any[] = [];
        book.availabilities.map((availability: any) => {
          currentBookAvailabilities.push(availability.school.slug);
          this.allBookAvailabilities.push(currentBookAvailabilities);
        });
      });

      for (let i = 0; i < this.allNotes.length; i++) {
        if (this.allNotes[i].length > 0) {
          let reviewsTotal = 0;
          this.allBooks[i].reviews.nodes.map((a: any) => {
            reviewsTotal += a.note;
          });

          this.booksReviews.push(
            Math.round(
              (reviewsTotal / this.allBooks[i].reviews.totalCount) * 10
            ) / 10
          );
        } else {
          this.booksReviews.push(0);
        }
      }
    });
  }
}

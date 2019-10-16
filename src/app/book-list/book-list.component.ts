import { Component, OnInit } from "@angular/core";
import { QueriesService } from "src/app/services/gql-queries.service";
import { Router } from "@angular/router";

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
  showAllBooks: boolean = true;
  showAvailableOnly: boolean = false;
  showUnAvailableOnly: boolean = false;

  constructor(private gqlQueries: QueriesService, private router: Router) {}

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
        });
        this.allBookAvailabilities.push(currentBookAvailabilities);
      });

      for (let i = 0; i < this.allNotes.length; i++) {
        if (this.allNotes[i].length > 0) {
          let totalReviews = 0;
          this.allBooks[i].reviews.nodes.map((a: any) => {
            totalReviews += a.note;
          });

          this.booksReviews.push(
            Math.round(
              (totalReviews / this.allBooks[i].reviews.totalCount) * 10
            ) / 10
          );
        } else {
          this.booksReviews.push(0);
        }
      }
    });
  }

  showAvailable() {
    this.showAllBooks = false;
    this.showUnAvailableOnly = false;
    this.showAvailableOnly = true;
  }

  showUnavailable() {
    this.showAllBooks = false;
    this.showAvailableOnly = false;
    this.showUnAvailableOnly = true;
  }

  showAll() {
    this.showAvailableOnly = false;
    this.showUnAvailableOnly = false;
    this.showAllBooks = true;
  }

  isValidCoverUrl(element: any) {
    let coverUrlRegEx = new RegExp(
      "^(http(s)?|ftp)://.*(jpeg|png|gif|bmp|jpg|webp)"
    );

    if (coverUrlRegEx.test(element)) {
      return true;
    }
    return false;
  }
}

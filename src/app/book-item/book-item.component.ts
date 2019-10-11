import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "apollo-client/util/Observable";
import { Apollo } from "apollo-angular";
import { QueriesService } from "src/app/services/gql-queries.service";

@Component({
  selector: "hn-book-item",
  templateUrl: "./book-item.component.html",
  styleUrls: ["./book-item.component.scss"]
})
export class BookItemComponent implements OnInit {
  bookData: any;
  isbn: string;
  borrower: string;
  tooltips = ["terrible", "bad", "normal", "good", "wonderful"];
  bookReview: number;
  myBookReview: number;
  bookBorrowerUID: string;
  bookBorrowerSlug: string;
  bookBorrowerName: string;
  BookAvailability: boolean = true;
  BookCurrentSchoolSlug: string;
  user: any;
  loading: boolean = true;
  reviewUID: string;

  BookReviewInputs: string[] = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];

  private routeSub: Subscription;
  constructor(
    public apollo: Apollo,
    private route: ActivatedRoute,
    private gqlQueries: QueriesService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.isbn = params["id"];
    });

    this.gqlQueries.getCurrentUser().then((userData: any) => {
      this.gqlQueries.getBookByISBN(this.isbn).then((bookData: any) => {
        this.user = userData.data.consumer;
        this.bookData = bookData.data.book;

        console.log(this.bookData);
        this.loading = bookData.loading;
        this.BookAvailability = bookData.data.book.availabilities[0].available;

        if (bookData.data.book.availabilities[0].borrower) {
          this.bookBorrowerUID =
            bookData.data.book.availabilities[0].borrower.uid;
          this.bookBorrowerSlug =
            bookData.data.book.availabilities[0].borrower.slug;
          this.bookBorrowerName =
            bookData.data.book.availabilities[0].borrower.name;
        }

        if (this.bookData.reviews.nodes.length > 0) {
          for (let i = 0; i < this.bookData.reviews.nodes.length; i++) {
            if (
              this.user.owner.uid ===
              this.bookData.reviews.nodes[i].reviewer.uid
            ) {
              this.reviewUID = this.bookData.reviews.nodes[i].uid;
              this.myBookReview = this.bookData.reviews.nodes[i].note;
              this.bookReview = this.myBookReview;
            }
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  rentCurrentBook() {
    this.gqlQueries
      .rentBook(this.isbn, this.bookData.availabilities[0].school.slug)
      .then((res: any) => {
        console.log(res);
        this.BookAvailability = res.data.borrowBook.availabilities[0].available;
        this.bookBorrowerUID =
          res.data.borrowBook.availabilities[0].borrower.uid;
      });
  }

  returnCurrentBook() {
    this.gqlQueries
      .returnBook(this.isbn, this.bookData.availabilities[0].school.slug)
      .then((res: any) => {
        console.log(res);
        this.BookAvailability = res.data.borrowBook.availabilities[0].available;
        this.bookBorrowerUID =
          res.data.borrowBook.availabilities[0].borrower.uid;
      });
  }

  sendBookReview() {
    if (this.myBookReview !== undefined && this.bookReview !== 0) {
      console.log("edit");
      this.gqlQueries
        .editBookReview(
          this.reviewUID,
          this.BookReviewInputs[this.bookReview - 1],
          "",
          ""
        )
        .then((res: any) => {
          this.myBookReview = this.bookReview;
        })
        .catch((err: any) => {
          console.error(err);
        });
    }

    if (this.bookReview === 0) {
      console.log("delete");

      this.gqlQueries
        .deleteBookReview(this.reviewUID)
        .then((res: any) => {
          this.myBookReview = undefined;
        })
        .catch((err: any) => {
          console.error(err);
        });
    }

    if (this.myBookReview === undefined) {
      console.log("add");

      this.gqlQueries
        .addBookReview(
          this.isbn,
          this.BookReviewInputs[this.bookReview - 1],
          "",
          ""
        )
        .then((res: any) => {
          this.myBookReview = this.bookReview;
          this.reviewUID = res.data.addBookReview.uid;
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }
}

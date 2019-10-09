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
        this.loading = bookData.loading;

        if (this.bookData.reviews.nodes.length > 0) {
          this.reviewUID = this.bookData.reviews.nodes[0].uid;
          if (
            this.user.owner.uid === this.bookData.reviews.nodes[0].reviewer.uid
          ) {
            this.myBookReview = this.bookData.reviews.nodes[0].note;
            this.bookReview = this.myBookReview;
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
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
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }

    if (this.bookReview === 0) {
      console.log("delete");
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
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }
}

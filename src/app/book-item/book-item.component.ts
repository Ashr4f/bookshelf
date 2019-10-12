import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "apollo-client/util/Observable";
import { Apollo } from "apollo-angular";
import { QueriesService } from "src/app/services/gql-queries.service";

@Component({
  selector: "hn-book-item",
  templateUrl: "./book-item.component.html",
  styleUrls: ["./book-item.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BookItemComponent implements OnInit {
  bookData: any;
  isbn: string;
  tooltips = ["terrible", "bad", "normal", "good", "wonderful"];
  bookReview: number;
  myBookReview: number;
  borrower: string;
  bookBorrowerUID: string;
  bookBorrowerSlug: string;
  bookBorrowerName: string;
  BookAvailability: boolean = true;
  bookInMySchool: boolean = false;
  BookCurrentSchoolSlug: string;
  rentedBookSchool: string;
  schoolsAvailabilities: any[] = [];
  user: any;
  userSchoolSlug: any;
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
        this.userSchoolSlug = this.user.owner.promo.school.slug;
        this.bookData = bookData.data.book;
        this.loading = bookData.loading;

        this.gqlQueries.getBeCodeSchools().then((res: { data: any }) => {
          res.data.schools.nodes.forEach((school: any) => {
            this.schoolsAvailabilities.push(school);
          });

          this.bookData.availabilities.map((a: any) => {
            this.schoolsAvailabilities.forEach(school => {
              console.log(a, school);
            });

            if (a.available === false) {
              a.borrower.bookLendings.forEach((b: any) => {
                if (b.book.isbn === this.isbn) {
                  if (this.userSchoolSlug === b.school.slug) {
                    this.BookAvailability = false;
                    this.rentedBookSchool = b.school.slug;
                    this.bookBorrowerName = a.borrower.name;
                    this.bookBorrowerUID = a.borrower.uid;
                  }
                }
              });
            }

            if (a.school.slug === this.userSchoolSlug) {
              this.bookInMySchool = true;
            }
          });
        });

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
      .rentBook(this.isbn, this.userSchoolSlug)
      .then((res: any) => {
        console.log(res);
        this.BookAvailability = false;
        res.data.borrowBook.availabilities.map((b: any) => {
          if (b.school.slug === this.userSchoolSlug) {
            this.bookBorrowerUID = b.borrower.uid;
          }
        });
      });
  }

  returnCurrentBook() {
    this.gqlQueries
      .returnBook(this.isbn, this.userSchoolSlug)
      .then((res: any) => {
        this.BookAvailability = true;
        this.bookBorrowerUID = undefined;
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

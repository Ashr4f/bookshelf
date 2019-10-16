import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "apollo-client/util/Observable";
import { Apollo } from "apollo-angular";
import { QueriesService } from "src/app/services/gql-queries.service";
import { formatDistance } from "date-fns";
import { PageTitleService } from "../services/page-title.service";

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
  bookReview: number = 3;
  allBookReviews: any[] = [];
  bookNotes: number = 0;
  myBookReview: number;
  myBookReviewComment: string = "";
  hasOwnReview: boolean = false;
  enableCommentEdit: boolean = false;
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
    private gqlQueries: QueriesService,
    private pageTitle: PageTitleService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.isbn = params["id"];
      this.bookReview = 3;
      this.allBookReviews = [];
      this.bookNotes = 0;
      this.myBookReviewComment = "";
      this.hasOwnReview = false;
      this.enableCommentEdit = false;
      this.BookAvailability = true;
      this.bookInMySchool = false;
      this.schoolsAvailabilities = [];
      this.loading = true;

      this.gqlQueries.getCurrentUser().then((userData: any) => {
        this.gqlQueries.getBookByISBN(this.isbn).then((bookData: any) => {
          this.user = userData.data.consumer;
          console.log(this.user);

          this.userSchoolSlug = this.user.owner.promo.school.slug;

          this.bookData = bookData.data.book;

          this.pageTitle.setPageTitle(`Bookshelf - ${this.bookData.title}`);

          this.gqlQueries
            .getBeCodeSchools()
            .then((res: { loading: boolean; data: any }) => {
              this.loading = res.loading;
              res.data.schools.nodes.forEach((school: any) => {
                school.available = false;
                this.schoolsAvailabilities.push(school);
              });

              this.bookData.availabilities.map((a: any) => {
                if (a.school.slug === this.userSchoolSlug) {
                  this.bookInMySchool = true;
                }

                this.schoolsAvailabilities.forEach(school => {
                  if (a.available === true) {
                    if (a.school.slug === school.slug) {
                      school.available = true;
                    }
                  }
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
              });
            });

          if (this.bookData.reviews.nodes.length > 0) {
            this.allBookReviews = this.bookData.reviews.nodes;
            let totalReviews = 0;
            this.allBookReviews.map((a: any) => {
              totalReviews += a.note;

              if (a.reviewer.slug === this.user.owner.slug) {
                this.hasOwnReview = true;
              }
            });
            totalReviews =
              Math.round(
                (totalReviews / this.bookData.reviews.totalCount) * 10
              ) / 10;
            this.bookNotes = totalReviews;

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
    });
  }

  ngOnDestroy() {
    this.pageTitle.setPageTitle("Bookshelf");
    this.routeSub.unsubscribe();
  }

  rentCurrentBook() {
    this.gqlQueries
      .rentBook(this.isbn, this.userSchoolSlug)
      .then((res: any) => {
        this.BookAvailability = false;
        this.schoolsAvailabilities.map(school => {
          if (school.slug === this.userSchoolSlug) {
            school.available = false;
          }
        });
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
        this.schoolsAvailabilities.map(school => {
          if (school.slug === this.userSchoolSlug) {
            school.available = true;
          }
        });
      });
  }

  addOwnReview() {
    this.gqlQueries
      .addBookReview(
        this.isbn,
        this.BookReviewInputs[this.bookReview - 1],
        "",
        this.myBookReviewComment
      )
      .then((res: any) => {
        this.myBookReview = this.bookReview;
        this.hasOwnReview = true;
        this.reviewUID = res.data.addBookReview.uid;
        this.allBookReviews.push(res.data.addBookReview);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  editOwnReview() {
    this.gqlQueries
      .editBookReview(
        this.reviewUID,
        this.BookReviewInputs[this.bookReview - 1],
        "",
        this.myBookReviewComment
      )
      .then((res: any) => {
        this.myBookReview = this.bookReview;
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  deleteOwnReview(review: HTMLElement) {
    let deleteConfirmation = confirm(
      "Are you sure you want to delete your own review?"
    );

    if (deleteConfirmation) {
      this.gqlQueries
        .deleteBookReview(this.reviewUID)
        .then((res: any) => {
          this.myBookReviewComment = undefined;
          this.myBookReview = undefined;
          this.hasOwnReview = false;

          this.allBookReviews.pop();
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  }

  formatCommentDate(commentDate: any) {
    return formatDistance(new Date(), new Date(commentDate));
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

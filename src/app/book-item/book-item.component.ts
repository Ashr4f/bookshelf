import { Component, Input, OnInit } from "@angular/core";
import { Book } from "../types";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "apollo-client/util/Observable";
import { Apollo } from "apollo-angular";
import { BOOK_QUERY } from "../graphql";

type Response = {
  book: any;
};

@Component({
  selector: "hn-book-item",
  templateUrl: "./book-item.component.html",
  styleUrls: ["./book-item.component.scss"]
})
export class BookItemComponent implements OnInit {
  bookData: any;
  isbn: string;

  private routeSub: Subscription;
  constructor(
    public apollo: Apollo,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.isbn = params["id"];
    });
    this.apollo
      .watchQuery<Response>({
        query: BOOK_QUERY,
        variables: {
          isbn: this.isbn
        }
      })
      .valueChanges.subscribe(response => {
        this.bookData = response.data.book;
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}

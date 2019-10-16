import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { QueriesService } from "../services/gql-queries.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  loading: boolean = true;
  user: any = {};

  constructor(
    public apollo: Apollo,
    private gqlQueries: QueriesService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.gqlQueries.getCurrentUser().then((res: any) => {
      this.user = res.data.consumer.owner;
      console.log(this.user);
      this.loading = false;
    });
  }

  returnBook(book: HTMLElement, bookISBN: any) {
    let confirmReturn = confirm(
      "Are you sure you want to perform this action?"
    );
    if (confirmReturn) {
      this.gqlQueries
        .returnBook(bookISBN, this.user.promo.school.slug)
        .then((res: any) => {
          book.parentNode.removeChild(book);
        });
    }
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

  logout() {
    this.auth.logout();
  }
}

import { Component, ElementRef, HostListener } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { User } from "./profile/profile.interface";
import { QueriesService } from "./services/gql-queries.service";
import { PageTitleService } from "./services/page-title.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  user: any;
  loading: boolean = true;
  showSearchResults: boolean = false;
  closeSearchResults: boolean = false;
  searchResults: any[] = [];
  searchLoading: boolean = false;

  @HostListener("document:click", ["$event"])
  clickedOutSide(event: any) {
    if (this.showSearchResults) {
      this.showSearchResults = false;
    }
  }

  clickedInsideSearchBar(event: Event) {
    event.stopPropagation();
    this.showSearchResults = true;
  }

  constructor(
    public apollo: Apollo,
    private router: Router,
    private auth: AuthService,
    private gqlQueries: QueriesService,
    private pageTitle: PageTitleService
  ) {
    this.auth.userVar$.subscribe((data: User) => {
      if (data !== null && data !== undefined) {
        this.user = data.consumer;
      }
      this.loading = false;
    });
  }
  ngOnInit() {
    this.auth.start();
    this.pageTitle.setPageTitle("Home");
  }

  booksSearch(query: string) {
    this.searchLoading = true;
    this.gqlQueries.searchForBooks(query).then(
      (res: any) => {
        this.searchResults = res.data.books.nodes;
        this.searchLoading = false;
      },
      err => {}
    );
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

import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { User } from "./profile/profile.interface";

type Book = {
  nodes: any;
};

type Response = {
  books: Book;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "bookshelf";
  user: any;
  loading: boolean = true;

  constructor(
    public apollo: Apollo,
    private router: Router,
    private auth: AuthService
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
  }

  logout() {
    this.auth.logout();
  }
}

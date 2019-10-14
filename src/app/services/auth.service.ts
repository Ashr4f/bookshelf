import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ME_QUERY } from "../graphql";
import { HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Subject } from "rxjs/internal/Subject";
import { User } from "../profile/profile.interface";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public accessVar = new Subject<boolean>();
  public accessVar$ = this.accessVar.asObservable();
  public userVar = new Subject<User>();
  public userVar$ = this.userVar.asObservable();
  constructor(private apollo: Apollo, private router: Router) {}

  public updateStateSession(newValue: boolean) {
    this.accessVar.next(newValue);
  }
  public updateUser(newValue: User) {
    this.userVar.next(newValue);
  }

  logout() {
    this.updateStateSession(false);
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  private sincroValues(result: User, state: boolean) {
    this.updateStateSession(state);
    this.updateUser(result);
  }

  start() {
    if (localStorage.getItem("token") !== null) {
      this.getMe().subscribe((result: User) => {
        if (result.consumer.active) {
          if (this.router.url === "/login" || this.router.url === "/register") {
            this.sincroValues(result, true);
            this.router.navigate(["/"]);
          }
        }
        this.sincroValues(result, result.consumer.active);
      });
    } else {
      this.sincroValues(null, false);
    }
  }
  getMe() {
    return this.apollo
      .watchQuery({
        query: ME_QUERY,
        fetchPolicy: "network-only",
        context: {
          headers: new HttpHeaders({
            authorization: localStorage.getItem("token")
          })
        }
      })
      .valueChanges.pipe(
        map((result: any) => {
          return result.data;
        })
      );
  }
}

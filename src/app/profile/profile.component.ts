import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { User } from "../profile/profile.interface";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  constructor(
    public apollo: Apollo,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {}
}

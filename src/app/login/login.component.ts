import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { LOGIN_MUTATION } from "../graphql";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { User } from "../profile/profile.interface";

type LoginData = {
  loginWithBasic: { token: string; connected: Boolean };
};

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  user: any;
  password: string = "";
  wrongData: Boolean = false;
  passwordVisible: Boolean = false;
  loginLoading: Boolean = false;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.status === "VALID") {
      this.loginLoading = true;
      this.user = this.validateForm.value.userName;
      this.password = this.validateForm.value.password;
      this.login();
    }
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apollo: Apollo,
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  login() {
    this.apollo
      .mutate<LoginData>({
        mutation: LOGIN_MUTATION,
        variables: {
          login: this.user,
          pass: this.password,
          useCookie: false
        }
      })
      .subscribe(
        response => {
          this.wrongData = false;
          this.loginLoading = false;
          localStorage.setItem("token", response.data.loginWithBasic.token);
          window.location.href = "/";
        },
        err => {
          this.wrongData = true;
          this.loginLoading = false;
        }
      );
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}

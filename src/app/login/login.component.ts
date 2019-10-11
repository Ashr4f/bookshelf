import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { LOGIN_MUTATION } from "../graphql";
import { ActivatedRoute, Router } from "@angular/router";

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
  user: string = "";
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
    private fb: FormBuilder
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
          if (response.data.loginWithBasic.connected) {
            this.router.navigate(["/"]);
          }
        },
        err => {
          this.wrongData = true;
          this.loginLoading = false;
          console.log(err);
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

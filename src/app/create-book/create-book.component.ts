import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ADD_BOOK_MUTATION } from "../graphql";
import gql from "graphql-tag";

type Response = {
  __type: { enumValues: [] };
  schools: { nodes: [string] };
};

@Component({
  selector: "app-create-book",
  templateUrl: "./create-book.component.html",
  styleUrls: ["./create-book.component.scss"]
})
export class CreateBookComponent implements OnInit {
  validateForm: FormGroup;
  bookExists: Boolean = false;
  CreateBookErrorMessage: string;

  isbn: string = "";
  title: string = "";
  author: string = "";
  editor: string = "";
  lang: string = "";
  cover: string = "";
  schools: [string] = [""];
  beCodeSchools: [string] = [""];
  format: string = "";
  BookFormats: [] = [];

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.status);

    if (this.validateForm.status === "VALID") {
      this.isbn = this.validateForm.value.bookISBN;
      this.title = this.validateForm.value.title;
      this.author = this.validateForm.value.author;
      this.lang = this.validateForm.value.bookLanguage;
      this.cover = this.validateForm.value.cover;
      this.format = this.validateForm.value.bookFormat;
      this.schools = this.validateForm.value.bookSchool;
      this.createBook();
    }
  }

  constructor(public apollo: Apollo, private fb: FormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      bookISBN: [null, [Validators.required]],
      title: [null, [Validators.required]],
      author: [null, [Validators.required]],
      bookFormat: [null, [Validators.required]],
      bookSchool: [null, [Validators.required]],
      bookLanguage: [null, [Validators.required]],
      cover: [null, [Validators.required]]
    });

    this.apollo
      .watchQuery<Response>({
        query: gql`
          {
            __type(name: "BookFormat") {
              name
              enumValues {
                name
              }
            }
            schools {
              nodes {
                slug
              }
            }
          }
        `
      })
      .valueChanges.subscribe(response => {
        this.BookFormats = response.data.__type.enumValues;
        this.beCodeSchools = response.data.schools.nodes;
      });
  }

  createBook() {
    this.apollo
      .mutate({
        mutation: ADD_BOOK_MUTATION,
        variables: {
          isbn: this.isbn,
          title: this.title,
          author: this.author,
          editor: this.editor,
          lang: this.lang,
          cover: this.cover,
          schools: this.schools,
          format: this.format
        }
      })
      .subscribe(
        response => {
          console.log(response);
        },
        err => {
          this.bookExists = true;
          this.CreateBookErrorMessage =
            "Another book already exists with the same key!";
        }
      );
  }
}

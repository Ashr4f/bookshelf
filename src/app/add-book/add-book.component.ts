import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { QueriesService } from "../services/gql-queries.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-book",
  templateUrl: "./add-book.component.html",
  styleUrls: ["./add-book.component.scss"]
})
export class AddBookComponent implements OnInit {
  validateForm: FormGroup;
  bookExists: Boolean = false;
  CreateBookErrorMessage: string;

  coverLoading = false;
  coverUrl: string;

  isbn: string = "";
  title: string = "";
  author: string = "";
  editor: string = "";
  lang: string = "";
  cover: string = "";
  schools: [string] = [""];
  beCodeSchools: [string] = [""];
  format: string = "";
  bookFormats: [] = [];
  bookLanguages: any[] = [
    {
      code: "en",
      name: "English"
    },
    {
      code: "fr",
      name: "Français"
    },
    {
      code: "nl",
      name: "Dutch"
    },
    {
      code: "de",
      name: "Deutsche"
    },
    {
      code: "tr",
      name: "Türkçe"
    },
    {
      code: "ar",
      name: "العربية"
    }
  ];
  constructor(
    public apollo: Apollo,
    private fb: FormBuilder,
    private gqlQueries: QueriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      bookISBN: [null, [Validators.required]],
      title: [null, [Validators.required]],
      author: [null, [Validators.required]],
      bookFormat: [null, [Validators.required]],
      bookSchool: [null, [Validators.required]],
      bookLanguage: [null, [Validators.required]],
      cover: [
        null,
        [
          Validators.required,
          Validators.pattern("^(http(s)?|ftp)://.*(jpeg|png|gif|bmp|jpg|webp)")
        ]
      ]
    });

    this.gqlQueries.getBookSelectOptions().then((response: any) => {
      this.bookFormats = response.data.__type.enumValues;
      this.beCodeSchools = response.data.schools.nodes;
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "VALID") {
      this.isbn = this.validateForm.value.bookISBN;
      this.title = this.validateForm.value.title;
      this.author = this.validateForm.value.author;
      this.lang = this.validateForm.value.bookLanguage;
      this.cover = this.validateForm.value.cover;
      this.format = this.validateForm.value.bookFormat;
      this.schools = this.validateForm.value.bookSchool;

      this.gqlQueries
        .createBook(
          this.isbn,
          this.title,
          this.author,
          this.editor,
          this.lang,
          this.cover,
          this.schools,
          this.format
        )
        .then(
          (response: any) => {
            this.router.navigate([`books/${response.data.addBook.isbn}`]);
          },
          err => {
            this.bookExists = true;
            this.CreateBookErrorMessage =
              "Another book already exists with the same key!";
          }
        );
    }
  }
}

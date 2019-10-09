import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { BOOK_QUERY, EDIT_BOOK_MUTATION } from "../graphql";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "apollo-client/util/Observable";
import gql from "graphql-tag";

type Response = {
  __type: { enumValues: [] };
  book: any;
  schools: { nodes: [string] };
};
@Component({
  selector: "app-edit-book",
  templateUrl: "./edit-book.component.html",
  styleUrls: ["./edit-book.component.scss"]
})
export class EditBookComponent implements OnInit {
  validateForm: FormGroup;
  editHasErrors: boolean = false;
  EditBookErrorMessage: string;

  isbn: string = "";
  title: string = "";
  author: string = "";
  editor: string = "";
  lang: string = "";
  cover: string = "";
  schools: [string] = [""];
  format: string = "";
  beCodeSchools: [string] = [""];
  currentSchool: string = "";
  BookFormats: [] = [];
  bookObject: object = {};

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      if (this.validateForm.controls[i].status === "INVALID") {
        this.editHasErrors = true;
        this.EditBookErrorMessage = "Please fill in the blank(s)";
      }
    }

    if (this.validateForm.status === "VALID") {
      this.title = this.validateForm.value.title;
      this.author = this.validateForm.value.author;
      this.lang = this.validateForm.value.bookLanguage;
      this.cover = this.validateForm.value.cover;
      this.format = this.validateForm.value.bookFormat;
      this.schools = this.validateForm.value.bookSchool;
      this.editHasErrors = false;
      this.EditBookErrorMessage = "";
      this.editCurrentBook();
    }
  }

  private routeSub: Subscription;
  constructor(
    public apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      author: [null, [Validators.required]],
      bookFormat: [null, [Validators.required]],
      bookSchool: [null, [Validators.required]],
      bookLanguage: [null, [Validators.required]],
      cover: [null, [Validators.required]]
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.isbn = params["id"];
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

    this.apollo
      .watchQuery<Response>({
        query: BOOK_QUERY,
        variables: {
          isbn: this.isbn
        }
      })
      .valueChanges.subscribe(response => {
        this.title = response.data.book.title;
        this.author = response.data.book.author;
        this.editor = response.data.book.editor;
        this.lang = response.data.book.lang.code;
        this.cover = response.data.book.cover;
        this.schools = response.data.book.availabilities;
        this.format = response.data.book.format;
        this.currentSchool = response.data.book.availabilities[0].school.slug;

        this.validateForm = this.fb.group({
          title: [this.title, [Validators.required]],
          author: [this.author, [Validators.required]],
          bookFormat: [this.format, [Validators.required]],
          bookSchool: [this.currentSchool, [Validators.required]],
          bookLanguage: [this.lang, [Validators.required]],
          cover: [this.cover, [Validators.required]]
        });
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  editCurrentBook() {
    this.apollo
      .mutate({
        mutation: EDIT_BOOK_MUTATION,
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
          this.router.navigate([`/books/${this.isbn}`]);
        },
        err => {
          console.log(err);
        }
      );
  }
}

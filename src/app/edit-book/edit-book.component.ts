import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "apollo-client/util/Observable";
import { QueriesService } from "../services/gql-queries.service";

@Component({
  selector: "app-edit-book",
  templateUrl: "./edit-book.component.html",
  styleUrls: ["./edit-book.component.scss"]
})
export class EditBookComponent implements OnInit {
  validateForm: FormGroup;
  editHasErrors: boolean = false;
  EditBookErrorMessage: string;
  currentUserName: string = "";

  isbn: string = "";
  title: string = "";
  author: string = "";
  editor: string = "";
  lang: string = "";
  cover: string = "";
  schools: [string] = [""];
  format: string = "";
  beCodeSchools: [string] = [""];
  currentSchools: any[] = [];
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
  bookObject: object = {};

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.status === "VALID") {
      this.title = this.validateForm.value.title;
      this.author = this.validateForm.value.author;
      this.lang = this.validateForm.value.bookLanguage;
      this.cover = this.validateForm.value.cover;
      this.format = this.validateForm.value.bookFormat;
      this.schools = this.validateForm.value.bookSchool;

      this.gqlQueries
        .editCurrentBook(
          this.isbn,
          this.title,
          this.author,
          this.editor,
          this.lang,
          this.cover,
          this.schools,
          this.format
        )
        .then(res => {
          this.router.navigate([`/books/${this.isbn}`]);
        });
    }
  }

  private routeSub: Subscription;
  constructor(
    public apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private gqlQueries: QueriesService
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

    this.gqlQueries.getBookByISBN(this.isbn).then((response: any) => {
      this.title = response.data.book.title;
      this.author = response.data.book.author;
      this.lang = response.data.book.lang.code || response.data.book.lang.name;
      this.cover = response.data.book.cover;
      this.schools = response.data.book.availabilities;
      this.format = response.data.book.format;
      this.schools.map((school: any) => {
        this.currentSchools.push(school.school.slug);
      });

      this.gqlQueries.getBookSelectOptions().then((res: any) => {
        this.bookFormats = res.data.__type.enumValues;
        this.beCodeSchools = res.data.schools.nodes;

        this.validateForm.controls.title.setValue(this.title);
        this.validateForm.controls.author.setValue(this.author);
        this.validateForm.controls.bookFormat.setValue(this.format);
        this.validateForm.controls.bookSchool.setValue(this.currentSchools);
        this.validateForm.controls.bookLanguage.setValue(this.lang);
        this.validateForm.controls.cover.setValue(this.cover);
      });
    });

    this.gqlQueries.getCurrentUser().then((user: any) => {
      console.log(user.data.consumer.owner.name);
      this.editor = user.data.consumer.owner.name;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}

import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { BOOK_QUERY, EDIT_BOOK_MUTATION } from "../graphql";
import { ActivatedRoute } from "@angular/router";
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

  private routeSub: Subscription;
  constructor(public apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
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
      .subscribe(response => {
        console.log(response);
      });
  }
}

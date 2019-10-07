import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ADD_BOOK_MUTATION } from "../graphql";
import * as RandExp from "randexp";
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
  isbn: string = new RandExp(/978-\d-\d{3}-\d{5}-\d/).gen();
  title: string = "";
  author: string = "";
  editor: string = "";
  lang: string = "";
  cover: string = "";
  schools: [string] = [""];
  beCodeSchools: [string] = [""];
  format: string = "";
  BookFormats: [] = [];

  constructor(public apollo: Apollo) {}

  ngOnInit() {
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
      .subscribe(response => {
        console.log(response);
      });
  }
}

import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import {
  ME_QUERY,
  BOOK_QUERY,
  ADD_BOOK_REVIEW,
  ALL_BOOKS_QUERY,
  EDIT_BOOK_REVIEW
} from "../graphql";

@Injectable({
  providedIn: "root"
})
export class QueriesService {
  constructor(private apollo: Apollo) {}

  async getCurrentUser() {
    return await this.apollo
      .query({
        query: ME_QUERY,
        fetchPolicy: "network-only"
      })
      .toPromise();
  }

  async getAllBooks() {
    // ADD PARAMETER HERE LATER
    return await this.apollo
      .query({
        query: ALL_BOOKS_QUERY,
        fetchPolicy: "network-only"
      })
      .toPromise();
  }

  async getBookByISBN(isbn: string) {
    return await this.apollo
      .query({
        query: BOOK_QUERY,
        variables: {
          isbn: isbn
        },
        fetchPolicy: "network-only"
      })
      .toPromise();
  }

  async addBookReview(isbn: any, note: any, lang: any, comment: any) {
    this.apollo
      .mutate({
        mutation: ADD_BOOK_REVIEW,
        variables: {
          bookISBN: isbn,
          review: {
            note: note,
            lang: lang,
            comment: comment
          }
        }
      })
      .toPromise();
  }

  async editBookReview(uid: any, note: any, lang: any, comment: any) {
    this.apollo
      .mutate({
        mutation: EDIT_BOOK_REVIEW,
        variables: {
          uid: uid,
          review: {
            note: note,
            lang: lang,
            comment: comment
          }
        }
      })
      .toPromise();
    console.log(uid, note, lang, comment);
  }
}

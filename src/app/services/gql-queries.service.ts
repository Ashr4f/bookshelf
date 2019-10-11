import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import {
  ME_QUERY,
  BOOK_QUERY,
  ADD_BOOK_REVIEW,
  ALL_BOOKS_QUERY,
  EDIT_BOOK_REVIEW,
  DELETE_BOOK_REVIEW,
  EDIT_BOOK_MUTATION,
  BOOK_SELECT_OPTIONS,
  ADD_BOOK_MUTATION,
  RENT_BOOK,
  RETURN_BOOK
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

  async getBookSelectOptions() {
    return await this.apollo
      .query({
        query: BOOK_SELECT_OPTIONS
      })
      .toPromise();
  }

  async createBook(
    isbn: any,
    title: any,
    author: any,
    editor: any,
    lang: any,
    cover: any,
    schools: any,
    format: any
  ) {
    return await this.apollo
      .mutate({
        mutation: ADD_BOOK_MUTATION,
        variables: {
          isbn: isbn,
          title: title,
          author: author,
          editor: editor,
          lang: lang,
          cover: cover,
          schools: schools,
          format: format
        }
      })
      .toPromise();
  }

  async editCurrentBook(
    isbn: any,
    title: any,
    author: any,
    editor: any,
    lang: any,
    cover: any,
    schools: any,
    format: any
  ) {
    return await this.apollo
      .mutate({
        mutation: EDIT_BOOK_MUTATION,
        variables: {
          isbn: isbn,
          title: title,
          author: author,
          editor: editor,
          lang: lang,
          cover: cover,
          schools: schools,
          format: format
        }
      })
      .toPromise();
  }

  async rentBook(book: string, school: string) {
    return this.apollo
      .mutate({
        mutation: RENT_BOOK,
        variables: {
          book: book,
          school: school
        }
      })
      .toPromise();
  }

  async returnBook(book: string, school: string) {
    return this.apollo
      .mutate({
        mutation: RETURN_BOOK,
        variables: {
          book: book,
          school: school
        }
      })
      .toPromise();
  }

  async addBookReview(isbn: any, note: any, lang: any, comment: any) {
    return await this.apollo
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
    return await this.apollo
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
  }

  async deleteBookReview(uid: any) {
    return await this.apollo
      .mutate({
        mutation: DELETE_BOOK_REVIEW,
        variables: {
          uid: uid
        }
      })
      .toPromise();
  }
}

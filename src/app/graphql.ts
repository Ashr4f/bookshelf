import { Book } from "./types";
import gql from "graphql-tag";

export const ADD_USER_MUTATION = gql`
  mutation registerWithBasic(
    $target: UserTargetInput!
    $login: String!
    $pass: String!
    $useCookie: Boolean
  ) {
    registerWithBasic(
      target: $target
      login: $login
      pass: $pass
      useCookie: $useCookie
    ) {
      connected
      token
      headers
      csrfToken
    }
  }
`;

export const ALL_BOOKS_QUERY = gql`
  query {
    books(all: true) {
      nodes {
        isbn
        title
        author
      }
    }
  }
`;

export const BOOK_QUERY = gql`
  query getBookByISBN($isbn: ID!) {
    book(isbn: $isbn) {
      isbn
      title
      author
      editor
      lang {
        code
      }
      availabilities {
        school {
          slug
        }
      }
      cover
      format
    }
  }
`;

export interface AllBooksQueryResponse {
  allBooks: Book[];
  loading: boolean;
}

export const ADD_BOOK_MUTATION = gql`
  mutation addBookMutation(
    $isbn: String!
    $title: String!
    $author: String!
    $editor: String!
    $lang: String!
    $cover: String
    $schools: [String!]!
    $format: BookFormat!
  ) {
    addBook(
      book: {
        isbn: $isbn
        title: $title
        author: $author
        editor: $editor
        lang: $lang
        cover: $cover
        schools: $schools
        format: $format
      }
    ) {
      isbn
    }
  }
`;

export const EDIT_BOOK_MUTATION = gql`
  mutation editBookMutation(
    $isbn: String!
    $title: String!
    $author: String!
    $editor: String!
    $lang: String!
    $cover: String
    $schools: [String!]!
    $format: BookFormat!
  ) {
    editBook(
      book: {
        isbn: $isbn
        title: $title
        author: $author
        editor: $editor
        lang: $lang
        cover: $cover
        schools: $schools
        format: $format
      }
    ) {
      isbn
      availabilities {
        school {
          slug
        }
      }
    }
  }
`;

export interface AddBookMutationResponse {
  addBook: Book;
  loading: boolean;
}

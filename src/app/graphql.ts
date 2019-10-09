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

export const LOGIN_MUTATION = gql`
  mutation loginWithBasic(
    $login: String!
    $pass: String!
    $useCookie: Boolean
  ) {
    loginWithBasic(login: $login, pass: $pass, useCookie: $useCookie) {
      connected
      token
      headers
      csrfToken
    }
  }
`;

export const ME_QUERY = gql`
  query {
    consumer {
      type
      active
      owner {
        uid
        slug
      }
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
        cover
        availabilities {
          available
        }
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
      reviews(all: true) {
        totalCount
        nodes {
          uid
          reviewer {
            slug
            uid
          }
          note
        }
      }
      availabilities {
        available
        borrower {
          name
        }
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

export const ADD_BOOK_REVIEW = gql`
  mutation addBookReviewMutation(
    $bookISBN: String!
    $review: BookReviewInput!
  ) {
    addBookReview(bookISBN: $bookISBN, review: $review) {
      note
      reviewer {
        name
        slug
      }
      book {
        reviews {
          edges {
            cursor
            node {
              note
            }
          }
          totalCount
        }
      }
      uid
    }
  }
`;

export const EDIT_BOOK_REVIEW = gql`
  mutation editBookReviewMutation($uid: ID!, $review: BookReviewInput!) {
    editBookReview(uid: $uid, review: $review) {
      note
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

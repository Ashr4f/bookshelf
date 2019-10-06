import { Book } from "./types";
import gql from "graphql-tag";

export const ALL_BOOKS_QUERY = gql`
  query {
    books(all: true) {
      nodes {
        title
        author
      }
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
      title
      author
      editor
      format
    }
  }
`;

export interface AddBookMutationResponse {
  addBook: Book;
  loading: boolean;
}

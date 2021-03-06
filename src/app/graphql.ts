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
        name

        bookLendings {
          school {
            name
          }
          book {
            isbn
            title
            cover
            author
          }
        }

        bookReviews {
          totalCount
          nodes {
            book {
              isbn
              title
              author
              cover
            }
          }
        }
        ... on Junior {
          avatar
          promo {
            school {
              slug
            }
          }
        }
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
        reviews(all: true) {
          totalCount
          nodes {
            note
          }
        }
        availabilities {
          available
          school {
            slug
          }
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
          createdAt {
            iso {
              datetime
            }
          }
          reviewer {
            slug
            uid
            name
            ... on Junior {
              avatar
            }
          }
          note
          comment
        }
      }
      availabilities {
        available
        borrower {
          name
          uid
          slug

          bookLendings {
            book {
              isbn
            }
            school {
              slug
            }
          }
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

export const SEARCH_FOR_BOOKS = gql`
  query searchForBooks(
    $fields: [BookFilterField!]!
    $query: String!
    $fuzzy: Boolean
  ) {
    books(filterOn: { fields: $fields, query: $query, fuzzy: $fuzzy }) {
      nodes {
        isbn
        title
        author
        cover
      }
    }
  }
`;

export const BOOK_SELECT_OPTIONS = gql`
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
`;

export const BECODE_SCHOOLS_SLUGS = gql`
  {
    schools {
      nodes {
        slug
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
    }
  }
`;

export const RENT_BOOK = gql`
  mutation rentBookMutation($book: String!, $school: String!) {
    borrowBook(book: $book, school: $school) {
      isbn
      availabilities {
        school {
          slug
        }
        borrower {
          uid
          name
          slug
        }
        available
      }
    }
  }
`;

export const RETURN_BOOK = gql`
  mutation returnBookMutation($book: String!, $school: String!) {
    returnBook(book: $book, school: $school) {
      isbn
      availabilities {
        borrower {
          uid
          name
          slug
        }
        available
      }
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
      comment
      createdAt {
        iso {
          datetime
        }
      }
      reviewer {
        name
        slug
        ... on Junior {
          avatar
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

export const DELETE_BOOK_REVIEW = gql`
  mutation deleteBookReviewMutation($uid: ID!) {
    deleteBookReview(uid: $uid)
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

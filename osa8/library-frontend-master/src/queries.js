import { gql  } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      id
      authorOf {
        title
        published
        author {
          name
          born
        }
      }
    }
  }
`

export const ALL_BOOKS = gql`
  query( $genreToSearch: String, $authorToSearch: String ) {
    allBooks(
      author: $authorToSearch,
      genre: $genreToSearch
    ) {
      title
      author {name}
      published
      genres
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author {
        name
        born
      }
      genres
    }
  }
`

export const EDIT_BIRTHDATE = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!){
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login( username: $username, password: $password ) {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {name}
      genres
    }
  }
`

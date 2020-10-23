const {
  ApolloServer, AuthenticationError,
  UserInputError, gql,
  PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { v4: uuid } = require('uuid')
const MONGODB_URI = 'mongodb+srv://fullstack:4NjQ6E@cluster0.sca9s.mongodb.net/library?retryWrites=true&w=majority'
const jwt = require('jsonwebtoken')
const pubsub = new PubSub()
const JWT_SECRET = 'SALAINEN_AVAIN'

console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
    type Book {
      title: String!
      published: Int!
      author: Author!
      id: ID!
      genres: [String]!
    }

    type Author {
      name: String!
      id: ID!
      born: Int
      authorOf: [Book!]!
      bookCount: Int!
    }

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    type Token {
      value: String!
    }

    type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book]!
      allAuthors: [Author!]!
      me: User
    }

    type Subscription {
      bookAdded: Book!
    }

    type Mutation {
      addBook(
        title: String!
        published: Int!
        author: String!
        genres: [String]!
      ): Book
      editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
    }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async (root, args) => {
      return await Author
        .find({})
        .populate('authorOf')
    },
    allBooks: async (root, args) => {
      let result = Book.find({})

      if(!args.author && !args.genre) {
        return result
      }

      if(args.author) {
        author = await Author.findOne({ name: args.author })

        if(author) {
            result = Book.find({ author: { $in: [ author.id ]}})
        }
      }

      if(args.genre) {
        result = Book.find({ genres: { $in: [ args.genre ]}})
      }

      return result
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      try {
        const currentUser = context.currentUser
        const author = await Author.findOne({ name: args.author })

        if(!currentUser) {
          throw new AuthenticationError("not authenticated")
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          author: null,
          genres: args.genres
        })

        if(author) {
          book.author = author._id
          author.authorOf = author.authorOf.concat(book._id)
          await author.save()
        } else {
          const newAuthor = new Author({
              name: args.author,
              authorOf: [book._id]
          })
          await newAuthor.save()
          book.author = newAuthor._id
        }
        await book.save()
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book


      } catch (error) {
          throw new UserInputError(error, {
            invalidArgs: args
          })
      }

    },
    editAuthor: async (root, args, context) => {
      try {
        const currentUser = context.currentUser
        const author = await Author.findOne({ name: args.name })

        if(!currentUser) {
          throw new AuthenticationError("not Authenticated")
        }

        if(!author) {
          throw 'Author not found!'
        }

        author.born = args.setBornTo

        author.save()
        return author
      } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
      }
    },
    createUser: (root, args) => {
      const user = new User(
        { username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
      .catch(error => {
        throw new UserInputError(error.message , {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if( !user || args.password !== 'salainen') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user.id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
  Author: {
    bookCount: (author) => {
      console.log('bookCount')
      return author.authorOf.length
    }
  },
  Book: {
    author: async (root) => {
      return author = await Author.findOne({ _id: root.author })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})

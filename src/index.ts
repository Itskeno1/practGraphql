import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { gql } from 'graphql-tag';
import mongoose from 'mongoose';

// Define los esquemas de Mongoose
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    stock: Number,
    price: Number
});

const authorSchema = new mongoose.Schema({
    name: String
});

const BookModel = mongoose.model('Book', bookSchema);
const AuthorModel = mongoose.model('Author', authorSchema);

const typeDefs = gql`
    type Book {
        id: ID
        title: String
        author: String
        stock: Int
        price: Float
    }

    type Author {
        id: ID
        name: String
    }

    type Query {
        books: [Book]
        book(id: ID): Book
        authors: [Author]
    }

    input BookInput {
        title: String
        author: String
        stock: Int
        price: Float
    }

    input UpdateBookInput {
        id: ID!
        title: String
        stock: Int
    }

    input DeleteBookInput {
        id: ID!
    }

    type Mutation {
        createBook(book: BookInput): Book
        updateBook(book: UpdateBookInput): Book
        deleteBook(book: DeleteBookInput): Book
    }
`;

const resolvers = {
    Query: {
        books: async () => await BookModel.find(),
        book: async (_parent: any, args: any) => await BookModel.findById(args.id),
        authors: async () => await AuthorModel.find()
    },
    Mutation: {
        createBook: async (_: void, args: any) => {
            const { title, author, stock, price } = args.book;
            try {
                const newBook = await BookModel.create({ title, author, stock, price });
                return newBook;
            } catch (error) {
                console.error(error);
            }
           
        },
        updateBook: async (_: void, args: any) => {
            const { id, title, stock } = args.book;
            try {
                const updatedBook = await BookModel.findByIdAndUpdate(id, { title, stock }, { new: true });
                return updatedBook;
            } catch (error) {
                console.error(error);
            }
           
        },
        deleteBook: async (_: void, args: any) => {
            try {
                const deletedBook = await BookModel.findByIdAndDelete(args.book.id);
                return deletedBook;
            } catch (error) {
                console.error(error);
            }
          
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = parseInt(process.env.PORT || "3000");

(async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || 'MONGODB_URI= mongodb://127.0.0.1:27017/practgraph');
        console.log("Database Connected", db.connection.name);
    } catch (error) {
        console.error(error);
    }

    const { url } = await server.listen(PORT);
    console.log(`Server ready at ${url}`);
})();

import 'dotenv/config'
import { ApolloServer } from '@apollo/server' 
import { startStandaloneServer } from '@apollo/server/standalone' 
import { gql } from 'graphql-tag'

const books: any = [
    {
        id: 1,
        title: 'The Awakening',
        author: 'Kate Chopin',
        stock: 2,
        price:10
    },
    {
        id: 2,
        title: 'City of Glass',
        author: 'Paul Auster',
        stock: 13,
        price:10
    },
    {
        id: 3,
        title: "The Great Gatsby",
        author: 'Paul Auster',
        stock: 21,
        price:10
    },
];

const authors = [
    {
        id:1,
        name: "Eugenio"
    },
    {
        id:2,
        name:"Checo  Perez"
    }
]



const typeDefs = gql`

    type Book{
        id: ID 
        title: String
        author: String
        stock: Int
        price: Float
    }

    type Author{
        id: ID
        name: String
    }

    type Query {
        books: [Book]
        book(id: ID): Book 
    }
    type Query {
        authors: [Author]
    }

    input BookInput {
        title:String
        price:Float
    }

    type Mutation {
        createBook(book: BookInput): Book
    }
`
 
const resolvers = {
    Query: {
        books: () => books,
        book: (_parent: any, args:any) => {
            const bookId = args.id;
            for(let book of books){
                if(book.id == bookId) return book;
            }
        },
        authors: () => authors // primero el nombre de la query y luego nombre del arreglo a retornar 
    },
    Mutation: {
        createBook:(__:void,args:any)=>{

            const bookInput = args.book;

            const book = {
                id: books.length + 1,
                title: bookInput.title,
                price: bookInput.price
            }
            books.push(book);
            return book;
        }
    }

}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const PORT = parseInt(process.env.PORT || "3000");

(async () =>{
    const { url } = await startStandaloneServer(server, {
        listen: {port: PORT}
    });
    console.log('corriendo ')
})();

console.log("OK!")
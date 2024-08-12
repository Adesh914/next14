import gql from "graphql-tag";

const UserSchema = gql`
    #userModel
    type User{
    id: ID!
    first_name: String
    last_name: String
    email: String
    password: String
    }
    type Query{
        Users(q:String):[User]
        User(id:ID!): User
    }
    
    #user input
    input UserInput{
        first_name: String
        last_name: String
        email: String
        password: String
    }
    type Mutation{
        #User
        add(input: UserInput):User
        edit(id: ID!, input:UserInput):User
        delete(id:ID!):User
    }
`;
module.exports = UserSchema;
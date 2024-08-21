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
    #Datatable
    type Datatable{
        datatable:[User]
        table_meta:pagination_set
    }
    type pagination_set{
        totalRow:Int
        totalFiltered: Int
        pageSize: Int
        totalPage:Int
    }
    #filter parameter pass as input type of object
    input UserFilter{
        first_name: String
        last_name: String
        email: String
    }
    type Query{
        Users(q:String):[User]
        User(id:ID!): User
        UserList(filter:UserFilter,q: String,pageNo:Int,pageSize:Int):Datatable
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
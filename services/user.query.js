import gql from "graphql-tag";
// https://www.apollographql.com/blog/pagination-and-infinite-scrolling#the-solution-fetchmore
export const USER_LIST = gql`
query Users($q: String) {
  Users(q: $q) {
    id
    first_name
    last_name
    email
    password
  }
}
`;
export const ADD_USER = gql`
mutation Add($input: UserInput) {
  add(input: $input) {
    id
    first_name
    last_name
    password
    email
  }
}
`;
export const DATATABLE_LIST = gql`
query UserList($q: String, $pageNo: Int, $pageSize: Int) {
  UserList(q: $q, pageNo: $pageNo, pageSize: $pageSize) {
    datatable {
      id
      first_name
      last_name
      email
      password
    }
    table_meta {
      totalRow
      totalFiltered
      pageSize
      totalPage
    }
  }
}
`;

/* 
Variables:{
  "input": {
"email": "rodala9822@luvnish.com",
"first_name": "Rodala",
"last_name": "luvnish",
"password": "123456",
"password": "123456"
  }
  
}
*/
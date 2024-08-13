import gql from "graphql-tag";

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
    pagination {
      totalRow
      totalFiltered
      pageSize
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
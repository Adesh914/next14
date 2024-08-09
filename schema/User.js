import gql from "graphql-tag";
class Schema {
    constructor() {
        this.typeDefs = gql`
      type Query {
        hello: String
      }
    `;

        this.resolvers = {
            Query: {
                hello: () => 'Hello, World!',
            },
        };
    }


}
export default Schema;
// const schema = new Schema();
// schema.start();
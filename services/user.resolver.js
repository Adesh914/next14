import UserService from "./user.service";
const user = new UserService();
const userResolver = {
    Query: {
        Users: async (_, args, context) => {
            return user.getUsers();
        },
        User: async (_, args, context) => {

        }
    },
    Mutation: {
        add: async (_, { input }, content) => {
            return user.createUser(input);
        },
        edit: async (_, { input }, context) => {

        },
        delete: async (_, { input }, context) => {

        }
    }
}


module.exports = userResolver;
import UserService from "./user.service";

const user = new UserService();
const userResolver = {
    Query: {
        UserList: async (_, args, context) => {
            console.log(args)
            const { q, pageNo, pageSize } = args;
            // const param = q ? { "name": new RegExp(`${q}`, "i") } : {};
            const userData = user.getUsers(pageSize, pageNo);
            const paginate = await user.getPagination(pageSize, pageNo);
            console.log(userData)

            return { datatable: userData, pagination: paginate }
        },
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
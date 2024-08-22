import UserService from "./user.service";

const user = new UserService();
const userResolver = {
    Query: {
        UserList: async (_, args, context) => {

            const { q, pageNo, pageSize, filter } = args; console.log("filter:", JSON.parse(filter));
            let param = {};
            // const param = q ? { "name": new RegExp(`${q}`, "i") } : {};
            // param = filter?.first_name ? param[first_name] = filter?.first_name : {};
            if (filter) {
                JSON.parse(filter).forEach(element => {
                    console.log("PARAM:", element)
                    param[element.id] = new RegExp(`${element.value}`, "i")
                });
            }
            // filter?.first_name ? param["first_name"] = new RegExp(`${filter?.first_name}`, "i") : ``;
            console.log("PARAM:", param)
            const userData = await user.getUsers(pageSize, pageNo, param);

            const paginate = await user.getPagination(pageSize, pageNo, param);
            // console.log(userData)

            return { datatable: userData, table_meta: paginate }
        },
        Users: async (_, args, context) => {
            return await user.getUsers();
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
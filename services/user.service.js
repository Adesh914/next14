// Import required dependencies
import { createHmac } from "node:crypto";
import UserModel from "../models/UserModel";
import { AuthenticationError } from "@apollo/server";
// Define the user service class
class UserService {
    /**
      * Get a user by ID
      * @param {string} id - User ID
      * @returns {Promise<User>} User object
      */
    async getUser(id) {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                throw new AuthenticationError('User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
 * Get all users
 * @returns {Promise<User[]>} Array of user objects
 */
    async getUsers(limit, currentPage, expr = {}) {
        try {

            const users = await UserModel.find(expr).skip(limit * (currentPage - 1)).limit(limit);
            return users;
        } catch (error) {
            throw error;
        }
    }
    async getPagination(limit, currentPage, expr = {}) {
        // const totalFiltered = await User.count(expr);

        const total = await UserModel.countDocuments();
        let no_of_pages = Math.ceil(total / limit);
        return { totalRow: total, totalFiltered: limit, totalPage: no_of_pages }
    }
    /**
   * Create a new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<User>} User object
   */
    async createUser(userData) {
        try {
            const user = new UserModel(userData);
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
    /**
   * Update a user
   * @param {string} id - User ID
   * @param {string} name - User name
   * @param {string} email - User email
   * @returns {Promise<User>} User object
   */
    async updateUser(id, name, email) {
        try {
            const user = await UserModel.findByIdAndUpdate(id, { name, email }, { new: true });
            if (!user) {
                throw new AuthenticationError('User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete a user
     * @param {string} id - User ID
     * @returns {Promise<void>}
     */
    async deleteUser(id) {
        try {
            return await User.findByIdAndRemove(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
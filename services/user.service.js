// Import required dependencies
import User from "../models/UserModel";
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
            const user = await User.findById(id);
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
    async getUsers() {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            throw error;
        }
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
            const user = new User(userData);
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
            const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
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
import userToken from "../models/UserToken";


class TokenService {
    // constructor(user) {
    //     this.user = user;
    // }

    /**
     * @saveToken as new document
     * @param {*} dataObj 
     */
    async insertToken(dataObj) {
        // console.log("dataObj:", dataObj)
        try {
            const new_document = new userToken(dataObj);
            await new_document.save();
            return new_document;
        } catch (error) {
            throw error;
        }
    }
    /**
     * update token by userId
     * @param {*} userId as filter
     * @param {*} obj as token document
     */
    async setToken(userId, obj) {
        try {
            const tokenDocResult = await userToken.findOneAndUpdate(userId, obj, { new: true });
            if (!tokenDocResult) {
                throw new AuthenticationError("some error occured due to authentication.");
            }
            return tokenDocResult;
        } catch (error) { throw error }
    }
    /**
     * GET TOKEN
     * @param {*} userId as filter
     * @returns as user document row
     */
    async getToken(userId) {
        try {
            const userDoc = await userToken.findOne(userId);
            // if (!userDoc) {
            //     throw new Error("No document found.");
            // }
            return userDoc;
        } catch (error) { throw error }
    }
}

module.exports = TokenService;
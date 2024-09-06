import mongoose from "mongoose";
const { Schema } = mongoose;
const tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true }, //ref: "User"
    jwtToken: { type: String, required: true },
    expiresAt: { type: Date } //, default: Date().now(), expires: 30 * 86400
});
module.exports = mongoose.models.Session || mongoose.model("Session", tokenSchema);
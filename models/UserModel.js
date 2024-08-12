import crypto from "node:crypto";
import mongoose, { Model } from "mongoose";
const { Schema } = mongoose;
mongoose.Promise = global.Promise
const userSchema = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    password: { type: String, select: false }

});
// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }
//     this.password = await bcrypt.hash(this.password, 10);
// });
module.exports = mongoose.models.MyUser || mongoose.model("MyUser", userSchema);
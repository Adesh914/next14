import mongoose, { Model } from "mongoose";
const { Schema } = mongoose;
mongoose.Promise = global.Promise
const userSchema = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email_address: { type: String },
    password: { type: String }

});
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
module.exports = mongoose.model.User || mongoose.model("User", userSchema);
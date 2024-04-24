const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: String,
        lastName: String,
        email:
        {
            type:String,
            unique: true
        },
        role: String,
        password: String
    }
);
//virtual are not stored on the data base. they are documents properties to get and set but do not persit in db
// getters are usefull for formatting or combaning fields while setter are useful for de-composing a single value
userSchema.virtual('fullname').get(function() {
    let fullName = this.name + ' ' + this.lastName;
    return fullName.toUpperCase();
})

module.exports = userSchema;
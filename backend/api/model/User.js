const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
        name: String,
        lastName: String,
        email: {
            type: String,
            unique: true
        },
        role: String,
        password: String,
        profile: {
            type: Schema.Types.ObjectId,
            refPath: 'roleRef'
        }
    }
);
userSchema.virtual('roleRef').get(function (){
    return this.role == 'PATIENT' ? 'patientProfile' : 'doctorProfile'
})
userSchema.virtual('fullname').get(function() {
    return `${this.name} ${this.lastName}`;

});

module.exports = userSchema;
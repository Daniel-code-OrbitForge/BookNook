const mongoose = require('mongoose');
const { schema } = require('./bookModel.js');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    user_UUID: {type:String, required:true, unique: true},
    username: {type:String, required:true, index:true},
    password: {type:String, required:true, unique:false, index:true},
    email: {type:String, unique:true, required:true},
    location: {type:String, unique:false, index:true, required:true},
}, {timestamps:true},
);

userSchema.pre('save', async function (next) {
    const SALT_ROUNDS = 10
//Command to hash password if it's new or modified
    if (!this.isModified('password'))
        return next();
    try{
        const hash =await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hash;
        next();
    } catch(error){
        next(error);
    };

});

//Method to compare plain password with hashed Password
    userSchema.methods.comparePassword = function(UserPassword){
        return bcrypt.compare(UserPassword, this.password);
    };
//Post-save hook for logging or auditing
    userSchema.post('save', function (doc, next){
        console.log(`New user created:${doc.username} (${doc.email})`);
        next();
    });
   

const User = mongoose.model("User", userSchema)
module.exports = User;
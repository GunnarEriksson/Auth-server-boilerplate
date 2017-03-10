const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Tell mongoose about the fields that the model should have
const bcrypt = require('bcrypt-nodejs');

// Define out model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
    const user = this; // Get access to the user model

    // Generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            // overwrite plain text password with encrypted password
            user.password = hash;
            next(); // Go a head and save the model.
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
}

// Create model class
const ModelClass = mongoose.model('user', userSchema);


// Export the model
module.exports = ModelClass;

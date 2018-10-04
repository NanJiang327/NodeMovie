const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    password: String,
    // 0: normal user
    // 1: verified user
    // 2: fullfilled user
    // >10: admin
    // >50: super admin
    role: {
        type: Number,
        default: 0,
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now(),
        },
    },
});

UserSchema.methods = {
    comparePassword: function(_password, cb) {
        if (this.password === _password) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    },
}


UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
})

UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    },
}

module.exports = UserSchema;

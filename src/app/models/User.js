const bcrypt = require('bcryptjs');

const mongoose = require ('../../database/connect');

const ROLES = require('../../config/roles');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: [ROLES.PATIENT, ROLES.EMPLOYEE, ROLES.ADMIN],
    default: ROLES.PATIENT,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});


const User = mongoose.model('User', UserSchema);


module.exports = User;
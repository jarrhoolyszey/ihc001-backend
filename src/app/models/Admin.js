const bcrypt = require('bcryptjs');

const mongoose = require ('../../database/connect');

const ROLES = require('../../config/roles');


const AdminSchema = new mongoose.Schema({
  nome: {
	type: String,
	required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  senha: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: [ROLES.PATIENT, ROLES.EMPLOYEE, ROLES.ADMIN],
    default: ROLES.ADMIN,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


AdminSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;

  next();
});


const Admin = mongoose.model('Admin', AdminSchema);


module.exports = Admin;
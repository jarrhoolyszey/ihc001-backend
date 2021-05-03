const bcrypt = require('bcryptjs');

const mongoose = require('../../database/connect');

const roles = require('../../config/roles');


const EspecialistaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  sobrenome: {
    type: String,
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
  habilitacao: {
    tipo: {
      type: String,
    },
    numero: {
      type: String,
    },
    especialidade: {
      type: String,
    }
  },
  telefone: {
    type: String,
  },
  permissao: {
    type: String,
    default: roles.ESPECIALISTA,
    select: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

EspecialistaSchema.pre('save', async function(next) {
  const hash = bcrypt.hashSync(this.senha, 10);
  this.senha = hash;

  this.updated = Date.now();

  return next();
});

const Especialista = mongoose.model('Especialista', EspecialistaSchema);


module.exports = Especialista;
const bcrypt = require('bcryptjs');

const mongoose = require('../../database/connect');

const roles = require('../../config/roles');


const PacienteSchema = new mongoose.Schema({
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
  },
  senha: {
    type: String,
    required: true,
    select: false,
  },
  CPF: {
    type: String,
    unique: false,
  },
  RG: {
    type: String,
    unique: false,
  },
  data_nascimento: {
    type: Date,
  },
  telefone: {
    type: String,
  },
  endereco: {
    logradouro: {
      type: String,
    },
    complemento: {
      type: String,
    },
    cep: {
      type: String,
    },
    estado: {
      type: String,
    },
    cidade: {
      type: String,
    },
    bairro: {
      type: String,
    }
  },
  permissao: {
    type: String,
    default: roles.PACIENTE,
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

PacienteSchema.pre('save', async function(next) {
  const hash = bcrypt.hashSync(this.senha, 10);
  this.senha = hash;

  this.updated = Date.now();

  return next();
});

const Paciente = mongoose.model('Paciente', PacienteSchema);


module.exports = Paciente;
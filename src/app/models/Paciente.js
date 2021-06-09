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
  sexo: {
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
    unique: true,
  },
  RG: {
    type: String,
    unique: true,
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
    numero: {
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
	  uppercase: true,
	  maxlength: 2,
	  minlength: 2,
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
  categorias: {
    type: Array,
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

PacienteSchema.pre('save', function(next) {
  const hash = bcrypt.hashSync(this.senha, 10);
  this.senha = hash;

  return next();
});

const Paciente = mongoose.model('Paciente', PacienteSchema);


module.exports = Paciente;
const bcrypt = require('bcryptjs');

const mongoose = require('../../database/connect');
const Schema = mongoose.Schema; 


const AtendimentoSchema = new mongoose.Schema({
  especialistaId:{
    type: Schema.Types.ObjectId,
    ref: 'Especialista',
  },
  pacienteId:{
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
  },
  motivo: {
    type: String,
  },
  prescricoes: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


const Atendimento = mongoose.model('Atendimento', AtendimentoSchema);


module.exports = Atendimento;
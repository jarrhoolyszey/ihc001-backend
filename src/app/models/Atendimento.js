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
  sintomas: {
    type: [String],
  },
  exames: {
    type: Array,
  },
  prescricoes: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
	type: Date,
  }
});



const Atendimento = mongoose.model('Atendimento', AtendimentoSchema);


module.exports = Atendimento;
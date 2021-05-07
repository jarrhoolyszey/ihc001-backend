const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: 'GET, POST, PUT, DELETE'
};

app.use(cors(corsOptions));
app.use(express.json());


// routes 
// require('./app/controllers/index')(app);
require('./app/controllers/authController')(app);
require('./app/controllers/userController')(app);
require('./app/controllers/especialistaController')(app);
require('./app/controllers/pacienteController')(app);
require('./app/controllers/atendimentosController')(app);

app.get('/', (req, res) => {
  res.json({
    message: 'ok',
  })
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
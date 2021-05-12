const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

const whitelist = [
  'http://localhost:3000',
  'https://ihc-frontend.herokuapp.com'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
  methods: 'GET, POST, PUT, DELETE'
};

//app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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
  console.log(`Server started at port ${port}`);
});
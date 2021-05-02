const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// routes 
require('./app/controllers/authController')(app);
require('./app/controllers/userController')(app);

app.get('/', (req, res) => {
  res.json({
    message: 'ok',
  })
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
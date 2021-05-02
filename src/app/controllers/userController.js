const express = require('express');

const auth = require('../middlewares/auth');
const hasRole = require('../middlewares/permissions');

const roles = require('../../config/roles');

const User = require('../models/User');

const router = express.Router();


// Middlewares
router.use(auth);

/**
 * Create a employee
 * auth: true
 * permisions: admin
 */
router.post('/employee', hasRole(roles.ADMIN), async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    if(await User.findOne({ email }))
      return res.status(409).json({ error: 'Employee already exists. '});
    
    const employee = await User.create({
      name, email, password, role: roles.EMPLOYEE
    });

    res.json({
      employee,
    })

  } catch(err) {
    console.log(err.message)
  }
});

/**
 * Delete a employee by ID
 */
router.delete('/employee/:id', hasRole(roles.ADMIN), async (req, res) => {
  const { id } = req.params;

  try {
    await User.findOneAndDelete(id, (err, doc) => {
      if(err) {
        console.log(err);
      } else {
        console.log('Deleted', doc);
      }
    });
    
    res.json({ msg: 'Employee deleted. '})

  } catch (err) {
    res.json({ error: 'Failed to delete employee '})
  }
});

/**
 * Get a employee by ID
 */
router.get('/employee/:id', hasRole(roles.ADMIN, roles.EMPLOYEE), async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ id })
  } catch (err) {

  }
});


module.exports = app => app.use('/users', router);

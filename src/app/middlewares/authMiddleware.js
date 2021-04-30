const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  
  if(!authorization)
    return res.status(401).json({ error: 'No token provided. '});

  // Bearer hash muito loko
  const parts = authorization.split(' ');

  if (!parts.length === 2)
    return res.status(401).send({ error: 'Token error' });
  
  const [ scheme, token ] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: 'Token malformatted. '});
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ error: 'Invalid token' });
    
    req.userId = decoded.id;

    return next();
  });
}
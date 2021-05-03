
/**
 * Runs after auth middleware when role permission is required.
 */
function hasRole() {
  return (req, res, next) => {
    const { userPermissao } = req;

    if (arguments) {
      for(let i=0; i<arguments.length; i++) {
        if( arguments[i] === userPermissao )
          return next();
      }
    }

    return res.status(401).json({ error: 'Don\'t have permission =(' });
  }
}

module.exports = hasRole;
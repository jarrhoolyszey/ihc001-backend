
/**
 * Runs after auth middleware when role permission is required.
 */
function hasRole() {
  return (req, res, next) => {
    const { userRole } = req;

    if (arguments) {
      for(let i=0; i<arguments.length; i++) {
        if( arguments[i] === userRole )
          return next();
      }
    }

    return res.status(401).json({ error: 'Don\'t have permission =(' });
  }
}

module.exports = hasRole;
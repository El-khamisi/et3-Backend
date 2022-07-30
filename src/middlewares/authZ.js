const { failedRes } = require('../utils/response');

exports.isAdmin = (req, res, next) => {
  try {
    const role = req.session.user.role;
    if (role && role == 'admin') return next();
    else throw new Error('You are NOT authorized to Admins Only Routes');
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

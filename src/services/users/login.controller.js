const User = require('./user.model');
const bcrypt = require('bcrypt');
const { successfulRes, failedRes } = require('../../utils/response');
const { NODE_ENV } = require('../../config/env');

exports.regUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password } = req.body;

    const prev = await User.findOne({ where: { email } });
    if (prev) return failedRes(res, 400, new Error('You already have an account'));

    if (email && password) {
      password = bcrypt.hashSync(password, 10);
    } else {
      return failedRes(res, 400, new Error('Email and password are REQUIRED'));
    }

    let saved = await User.create({ first_name, last_name, email, password });

    const token = saved.generateToken();

    req.session.user = saved;

    const user = {
      id: saved.id,
      name: `${saved.first_name} ${saved.last_name}`,
      email: saved.email,
      role: saved.role,
    };
    return successfulRes(res, 201, { user, token });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logUser = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return failedRes(res, 400, new Error('Email and password are REQUIRED'));
  }

  try {
    let logged = await User.findOne({ where: { email }, attributes: { include: ['password'] } });

    if (!logged) {
      return failedRes(res, 400, new Error('Email is invalid'));
    }

    const matched = bcrypt.compareSync(password, logged._previousDataValues.password);
    logged.password = undefined;
    if (!logged || !matched) {
      return failedRes(res, 400, new Error('Email or Password is invalid'));
    } else {
      const token = logged.generateToken(req, res);
      req.session.user = logged;

      const user = {
        id: logged._id,
        name: `${logged.first_name} ${logged.last_name}`,
        email: logged.email,
        role: logged.role,
      };

      return successfulRes(res, 200, { user, token });
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy(() => {});

    res.cookie('authorization', '', {
      sameSite: NODE_ENV == 'dev' ? false : 'none',
      secure: NODE_ENV == 'dev' ? false : true,
    });

    res.cookie('s_id', '', {
      sameSite: NODE_ENV == 'dev' ? false : 'none',
      secure: NODE_ENV == 'dev' ? false : true,
    });

    return successfulRes(res, 200, 'You have been logged out successfully');
  } catch (err) {
    return failedRes(res, 500, 'Invalid logout operation');
  }
};

exports.resetPassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const user_id = req.session.user.id;
  try {
    const user = await User.findByPk(user_id, { attributes: { include: ['password'] } });
    if (!user) {
      return failedRes(res, 400, new Error('User not found'));
    }
    const matched = bcrypt.compareSync(current_password, user.password);
    if (!matched) {
      return failedRes(res, 400, new Error('Current password is invalid'));
    } else {
      user.password = bcrypt.hashSync(new_password, 10);
      await user.save();
      return successfulRes(res, 200, 'Password has been changed successfully');
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

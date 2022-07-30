const User = require('./user.model');
const bcrypt = require('bcrypt');
const { successfulRes, failedRes } = require('../../utils/response');
const { NODE_ENV, TOKENKEY } = require('../../config/env');

exports.regUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password, phone } = req.body;

    const prev = await User.findOne({ email }).exec();
    if (prev) return failedRes(res, 400, new Error('You already have an account'));

    if (email && password) {
      password = bcrypt.hashSync(password, 10);
    } else {
      throw new Error('Email and password are REQUIRED');
    }
    let saved = new User({ first_name, last_name, email, password, phone });
    await saved.save();

    const token = saved.generateToken(req, res);

    req.session.user = saved;

    const user = {
      id: saved._id,
      name: `${saved.first_name} ${saved.last_name}`,
      photo: saved.photo,
      email: saved.email,
      isVerified: saved.isVerified,
      role: saved.role,
    };
    return successfulRes(res, 201, { user, token, email_verifiction: info.response });
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
    let logged = await User.findOne({
      email,
    }).exec();

    if (!logged) {
      return failedRes(res, 400, new Error('Email is invalid'));
    }

    const matched = bcrypt.compareSync(password, logged.password);
    logged.password = undefined;
    if (!logged || !matched) {
      return failedRes(res, 400, new Error('Email or Password is invalid'));
    } else {
      const token = logged.generateToken(req, res);

      req.session.user = logged;

      const user = {
        id: logged._id,
        name: `${logged.first_name} ${logged.last_name}`,
        photo: logged.photo,
        email: logged.email,
        isVerified: logged.isVerified,
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
    const session = MongoStore.create({ client: mongoose.connection.getClient() });
    session.destroy(req.sessionID);

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
  const user_id = res.locals.user.id;
  try {
    const user = await User.findById(user_id).exec();
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

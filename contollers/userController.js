/* eslint-disable camelcase */
const {
  userRegister,
  userLogin,
  userLogout,
  //  updateBalance,
  getCurrentUser,
  getNewTokens,
  addNewBalance,
} = require('../services/users');

class UserController {
  async register(req, res) {
    const { email, password } = req.body;
    const { acces_token, refresh_token, sid, user } = await userRegister({
      email,
      password,
    });
    res.status(201).json({
      status: 'success',
      data: {
        headers: {
          acces_token,
          refresh_token,
          sid,
        },
        user: {
          id: user._id,
          email: user.email,
          balance: user.balance,
        },
      },
    });
  }

  async logIn(req, res) {
    const { email, password } = req.body;
    const { acces_token, refresh_token, sid, user } = await userLogin({
      email,
      password,
    });
    res.status(200).json({
      status: 'success',
      data: {
        headers: {
          acces_token,
          refresh_token,
          sid,
        },
        user: {
          id: user._id,
          email: user.email,
          balance: user.balance,
        },
      },
    });
  }

  async logOut(req, res) {
    const currentSession = req.session;
    await userLogout({ currentSession });
    req.user = null;
    req.session = null;
    res.status(200).json({
      status: 'success',
      data: {
        message: 'You are logged out',
      },
    });
  }

  async addNewBalanceCtrl(req, res) {
    //  const { _id: id } = req.user;
    const { balance } = req.params;

    const result = await addNewBalance({ user: req.user, balance });
    // const result = await updateBalance({ id, balance });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  }

  async getCurrentUserCtrl(req, res) {
    const result = await getCurrentUser(req.user);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  }

  async refreshTokens(req, res) {
    const { authorization } = req.headers;
    const session = req.body.sid;
    const { new_acces_token, new_refresh_token, newSid } = await getNewTokens({
      authorization,
      session,
    });
    res.status(200).json({
      status: 'success',
      data: {
        new_acces_token,
        new_refresh_token,
        newSid,
      },
    });
  }
}

module.exports = new UserController();

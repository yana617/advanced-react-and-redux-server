const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');

const tokenForUser = (user) => jwt.sign({ sub: user._id }, config.secret);

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'No email or password' })
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ error: 'User email already in use' });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.json({ success: true, token: tokenForUser(newUser) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const signin = async (req, res) => {
  try {
    res.json({ success: true, token: tokenForUser(req.user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  signup,
  signin,
};

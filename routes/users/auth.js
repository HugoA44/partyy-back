const router = require("express").Router();

const { generateToken } = require("../../helpers/TokenHelper");

const User = require("../../models/User");

router.route("/register").post((req, res) => {
  const { email, password, firstName, lastName, phone, picture, friends } =
    req.body;

  if (!email || !password)
    return res.status(500).send("Email or password is missing");

  const user = new User({
    email,
    password,
    firstName,
    lastName,
    phone,
    picture,
    friends,
  });

  user.save((error, result) => {
    if (error) return res.status(500).send(error);
    const _user = result.toObject();
    delete _user.password;
    const payload = {
      id: _user._id,
    };
    generateToken(payload, (error, token) => {
      if (error) return res.status(500).send("Error while generating token");
      // On renvoit l'utilisateur créé et le token
      return res.send({
        user: _user,
        token,
      });
    });
  });
});

router.route("/login").post((req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(500).send("Email or password is missing");

  User.findOne({ email: email }, (error, user) => {
    if (error || !user) return res.status(403).send("Invalid Credentials");

    user.comparePassword(password, (error, isMatch) => {
      if (error || !isMatch) return res.status(403).send("Invalid Credentials");

      user = user.toObject();

      delete user.password;

      const payload = {
        id: user._id,
      };

      generateToken(payload, (error, token) => {
        if (error) return res.status(500).send("Error while generating token");
        return res.send({
          user,
          token,
        });
      });
    });
  });
});

module.exports = router;

const jwt = require("jsonwebtoken");

const generateToken = (payload, callback) => {
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
    (error, token) => {
      if (error) callback(error);
      callback(null, token);
    }
  );
};

const extractIdfromRequestAuthHeader = (req) => {
  const { authorization } = req.headers;

  console.log(authorization);
  if (authorization) {
    const token = authorization.split(" ")[1];
    if (token) {
      return jwt.decode(token).id;
    }
  }
};

module.exports = {
  generateToken,
  extractIdfromRequestAuthHeader,
};

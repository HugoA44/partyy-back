const router = require("express").Router();

const User = require("../../models/User");

const withAuth = require("../../middlewares/authMiddleware");
const { extractIdfromRequestAuthHeader } = require("../../helpers/TokenHelper");

// Récupère et retourne un utilisateur par son ID
router.route("/").get(withAuth, (req, res) => {
  const id = extractIdfromRequestAuthHeader(req);

  User.findById(id)
    .select("-password")
    .then((result) => res.send(result))
    .catch((error) => res.status(500).send(error));
});
// Récupère et retourne un utilisateur par son ID
router.route("/").patch((req, res) => {
  const {
    body: { user },
  } = req;
  if (!user) return res.status(500).send("user Object is missing");

  const id = user._id;
  if (!id) return res.status(500).send("ID is missing");
  User.findByIdAndUpdate(id, user, (error, result) => {
    if (error) return res.status(500).send(error);
    User.find((error, result) => {
      if (error) {
        return res.status(500).send("Erreur lors de la récupération des users");
      } else {
        return res.send(result);
      }
    });
  });
});

// Récupère et retourne un utilisateur
router.route("/members").get((req, res) => {
  User.find((error, result) => {
    if (error) {
      return res.status(500).send("Erreur lors de la récupération des membres");
    } else {
      return res.send(result);
    }
  }).select("-password");
});

router.route("/member").get((req, res) => {
  console.log(req.query.id);
  const user = {
    _id: req.query.id,
  };
  User.findById(user._id, (error, result) => {
    if (error) {
      return res.status(500).send("Erreur lors de la récupération du membre");
    } else {
      return res.send(result);
    }
  }).select("-password");
});

module.exports = router;

// Cette vérification sert à faire fonctionner l'api sur mon serveur en ligne
if (typeof PhusionPassenger !== "undefined") {
  PhusionPassenger.configure({ autoInstall: false });
}

// Import pour utiliser les variables d'environnement
require("dotenv").config();

// Initialisation de Express
const express = require("express");
// Initialisation de mongoose qui va permettre l'utilisation de MongoDB
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}.jpg`);
  },
});
const upload = multer({ storage: storage });

const loggerMiddleware = require("./middlewares/logger");

const app = express();

app.use(cors());
app.use(loggerMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const router = express.Router();

const port = process.env.PORT;

// Connexion à la base de données MongoDB
const mongoDbConnectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoDbConnectionString, null, (error) => {
  if (error) throw new Error(error);
});

const db = mongoose.connection;

db.once("open", () => {
  console.info("Connexion à la base : OK");
});

app.post("/upload-avatar", upload.single("avatar"), function (req, res, next) {
  console.log(req.file, req.body);
  console.log(req.body);
  return res.send(req.file);
});

app.use(router);

// Création de
app.use("/events", require("./routes/events"));
app.use("/auth", require("./routes/users/auth"));
app.use("/me", require("./routes/users"));
app.use("/users", require("./routes/users"));

// Cette vérification sert à faire fonctionner l'api sur mon serveur en ligne
if (typeof PhusionPassenger !== "undefined") {
  app.listen("passenger");
} else {
  app.listen(4000);
}

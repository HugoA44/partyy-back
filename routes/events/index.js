const router = require("express").Router();

const Event = require("../../models/Event");

router
  .route("/")
  .get((req, res) => {
    Event.find((error, result) => {
      if (error) {
        return res
          .status(500)
          .send("Erreur lors de la récupération des événements");
      } else {
        return res.send(result);
      }
    });
  })
  .post((req, res) => {
    const { body } = req;
    const { name } = body;

    console.log(req.body);

    // if (!name) return res.status(500).send("Name is missing");
    // if (!description) return res.status(500).send("Description is missing");

    const event = new Event(body);

    event.save((error, result) => {
      if (error) return res.status(500).send(error);
      Event.find((error, result) => {
        if (error) {
          return res
            .status(500)
            .send("Erreur lors de la récupération des événements");
        } else {
          return res.send(result);
        }
      });
    });
  })
  .delete((req, res) => {
    const id = req.query.id;

    console.log(id);
    if (!id) return res.status(500).send(req);

    Event.findByIdAndDelete(id, (error, result) => {
      if (error) res.status(500).send(error);
      Event.find((error, result) => {
        if (error) {
          return res
            .status(500)
            .send("Erreur lors de la récupération des événements");
        } else {
          return res.send(result);
        }
      });
    });
  })
  .patch((req, res) => {
    const {
      body: { event },
    } = req;
    if (!event) return res.status(500).send("event Object is missing");

    const id = event._id;
    if (!id) return res.status(500).send("ID is missing");
    Event.findByIdAndUpdate(id, event, (error, result) => {
      if (error) return res.status(500).send(error);
      Event.find((error, result) => {
        if (error) {
          return res
            .status(500)
            .send("Erreur lors de la récupération des events");
        } else {
          return res.send(result);
        }
      });
    });
  });

router.route("/one").get((req, res) => {
  const event = {
    _id: req.query.id,
  };
  Event.findById(event._id, (error, result) => {
    if (error) {
      return res
        .status(500)
        .send("Erreur lors de la récupération des événements");
    } else {
      return res.send(result);
    }
  });
});

module.exports = router;

const router = require("express").Router();
const { isDeveloperAuthenticated } = require("../middleware/isAuthenticated");
const ProjectHistory = require("../models/projectHistory");
const ApiError = require("../utils/ApiError");

router.route("/")
  .get((req, res, next) => {
    // this queryObject is beneficial when some wrong query which is not intended is used in the URL
    const queryObject = {};

    // destructuring query key from URL.
    const { developer } = req.query;

    // FILTERING based on developer _id
    if (developer) {
      queryObject.developer = developer;
    }

    ProjectHistory.find(queryObject)
      .then((documents) => {
        if (documents.length === 0) {
          res.status(200).json({
            message: "No Projects History found. Insert some data please.",
            data: documents,
            errors: null,
          });
        } else {
          res.status(200).json({
            message: "Fetched Projects History successfully.",
            data: documents,
            errors: null,
          });
        }
      })
      .catch((error) => next(new ApiError(422, "Error fetching Projects History.", error.toString())));
  })

  .post(isDeveloperAuthenticated, (req, res, next) => {
    const project = req.body;

    ProjectHistory.create(project)
      .then((document) => {
        res.status(201).json({
          message: "Project History posted successfully.",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error posting project histroy", error.toString())));
  });

router.route("/:uid")
  .get(isDeveloperAuthenticated, (req, res, next) => {
    ProjectHistory.findOne({ uid: req.params.uid })
      .then((document) => {
        if (!document) {
          throw Error("Project not found.");
        }
        res.status(200).json({
          message: "Fetched Project history successfully",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error fetching project history", error.toString())));
  })

  .patch(isDeveloperAuthenticated, (req, res, next) => {
    const updatedProject = req.body;

    ProjectHistory.findOneAndUpdate({ uid: req.params.uid }, { ...updatedProject }, { new: true })
      .then((document) => {
        if (!document) {
          throw Error("Project not found.");
        }
        res.status(200).json({
          message: "Updated Project history successfully",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error updating project history", error.toString())));
  })

  .delete(isDeveloperAuthenticated, (req, res, next) => {
    ProjectHistory.deleteOne({ uid: req.params.uid })
      .then((document) => {
        if (document.deletedCount === 0) {
          throw Error("Project now found.");
        }
        res.status(200).json({
          message: "Deleted Project history succesfully",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error deleting project history", error.toString())));
  });
module.exports = router;

const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { isDeveloperAuthenticated, roleBasedAuthentication } = require("../middleware/isAuthenticated");
const Proposal = require("../models/proposal");
const ApiError = require("../utils/ApiError");

// need this to convert the _id obtained from query params into mongodb ObjectId type.
const { ObjectId } = mongoose.Types;

router.route("/")
  // roleBasedAuthentication is a middlware powered by other 2 middlwares to conditionally verfy the authToken.
  .get(roleBasedAuthentication, (req, res, next) => {
    const queryObject = {};
    const {
      developer, project, organization, count,
    } = req.query;
    console.log("req.query is ", req.query);

    // had to put the find method in a variable as we needed to put sort over it again.
    // `populate` is used to fetch the foreign key referenced document in the find response based on the keys passed as an argument to the method.
    // sending only the selected fields in the 2nd arg of populate()
    let fetchedData = Proposal.find().populate("developer", "fname lname email profile_pic uid").populate("project", "title uid thumbnail").populate("organization", "name uid");

    // FILTERING BASED ON 3 KEYS - developer, organization and project.
    if (developer) {
      // converting to `new ObjectId("64ac1d8cb20")` type for comparison in filter method.
      queryObject.developer = new ObjectId(developer);
    }
    if (project) {
      queryObject.project = new ObjectId(project);
    }
    if (organization) {
      queryObject.organization = new ObjectId(organization);
    }
    if (count) {
      fetchedData = Proposal.countDocuments(queryObject);
    }
    // console.log("qeury is ", fetchedData);
    fetchedData
      .then((documents) => {
        console.log("docs are ", documents);
        // console.log("docs are ", res);
        // once we get all the documents the filter the data based on query parameter key and value
        // console.log("docs are ", documents);
        let filteredDocs;
        if (queryObject) {
          // sending count response
          if (count) {
            return res.status(200).json({
              message: "Counted proposals successfully.",
              data: documents,
              errors: null,
            });
          }
          filteredDocs = documents.filter((doc) => {
            if (developer) { // FILTER SPECIFIC DEV
              // equals() method is used to compare the ObjectId values
              // === cant be used since it is not String.
              return doc.developer._id.equals(queryObject.developer);
            }
            if (organization) { // FILTER SPECIFIC ORG
              return doc.organization._id.equals(queryObject.organization);
            } if (project) {
              // FILTER SPECIFIC PROJECT
              return doc.project._id.equals(queryObject.project);
            }
            // return the OG response if no queryParam
            return documents;
          });
        }
        if (documents.length === 0) {
          // returns response of empty array with 'successful request' 200 code
          res.status(200).json({
            message: "No proposals data found. Insert some data please.",
            data: documents,
            errors: null,
          });
        } else {
          res.status(200).json({
            message: "Fetched proposals successfully.",
            data: filteredDocs,
            // data: documents,
            errors: null,
          });
        }
      })
      .catch((error) => next(new ApiError(422, "Error fetching proposals", error.toString())));
  })

  // isDeveloperAuthenticated is a middlware
  .post(isDeveloperAuthenticated, (req, res, next) => {
    const proposal = req.body;
    Proposal.create(proposal)
      .then((document) => {
        res.status(201).json({
          message: "Posted proposals successfully.",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error creating proposal", error.toString())));
  });

router.route("/:uid")

  // roleBasedAuthentication is a middlware
  // developer can should be able to delete proposal
  // organization should be able accept/reject the proposal
  .patch(roleBasedAuthentication, (req, res, next) => {
    const updatedProposal = req.body;

    Proposal.findOneAndUpdate({ uid: req.params.uid }, { ...updatedProposal }, { new: true })
      .then((document) => {
        if (!document) {
          throw Error("Proposal not found.");
        }
        res.status(200).json({
          message: "Updated proposal successfully.",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error updating proposal.", error.toString())));
  })

  // isDeveloperAuthenticated is a middlware
  .delete(isDeveloperAuthenticated, (req, res, next) => {
    Proposal.deleteOne({ uid: req.params.uid })
      .then((document) => {
        if (document.deletedCount === 0) {
          throw Error("Proposal not found.");
        }
        res.status(200).json({
          message: "Deleted proposal successfully.",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error deleting proposal.", error.toString())));
  });

module.exports = router;

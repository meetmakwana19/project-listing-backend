const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const Organization = require("../models/organization");
const ApiError = require("../utils/ApiError");
const { deleteTmp } = require("../utils/deleteTmp");

router.route("/")
  .get((req, res, next) => {
    Organization.find().populate("org_projects")
      .then((documents) => {
        res.status(200).json({
          message: "Fetched organization successfully.",
          data: documents,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(400, "Error fetching organizations.", error.toString())));
  })

  .post((req, res, next) => {
    const organization = req.body;
    const file = req.files.photo;

    try {
      const cloudinaryUpload = promisify(cloudinary.uploader.upload);
      return cloudinaryUpload(file.tempFilePath)
        .then((result) => {
          organization.banner_img = result.url;
          return Organization.create(organization);
        })
        .then((document) => {
          res.status(201).json({
            message: "Organization created successfully.",
            data: document,
            errors: null,
          });
          deleteTmp(file);
        })
        .catch((error) => {
          // console.log("Error --", error);
          // this if condition is for cloudinaryUpload(file.tempFilePath) promise as it returns error in object form with key `http_code` over here so handling it accordingly for that specific argument of tempFilePath
          // a typo in `tempFilePath` spelling will trigger satisfy this `if` block.
          if (error.http_code) {
            next(new ApiError(422, "Error creating organization!", JSON.stringify(error)));
          } else {
            next(new ApiError(422, "Error creating organization.", error.toString()));
          }
        });
    } catch (error) {
      return next(new ApiError(422, "Error creating organization..", error.toString()));
    }
  });

router.route("/:uid")
  .get((req, res, next) => {
    Organization.findOne({ uid: req.params.uid }).populate("org_projects")
      .then((document) => {
        if (!document) {
          throw Error("Organization not found.");
        }
        res.status(200).json({
          message: "Fetched organization successfully",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(400, "Error fetching organization.", error.toString())));
  })

  .patch((req, res, next) => {
    const organization = req.body;

    // respone bydefault comes an old document so giving new:true option to get a fresh updated document.
    Organization.findOneAndUpdate({ uid: req.params.uid }, { ...organization }, { new: true })
      .then((document) => {
        if (!document) {
          throw Error("Organization not found.");
        }
        return res.status(200).json({
          message: "Updated organization successfully.",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(422, "Error updating organization.", error.toString())));
  })
  .delete((req, res, next) => {
    Organization.findOneAndDelete({ uid: req.params.uid })
      .then((document) => {
        // deleteOne method doesnt return the found/deleted document
        // but it returns a key `deletedCount` with value 0 or 1
        // so if it is 0 means nothing was deleted means the documen was not found to delete.
        if (!document.deletedCount) {
          throw Error("Organization not found");
        }
        return res.status(200).json({
          message: "Deleted organization successfully.",
          data: document,
          errors: null,
        });
      })
      .catch((error) => next(new ApiError(400, "Error deleting organization.", error.toString())));
  });

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Data = require("../models/data");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Backend server for TextStore" });
});

router.post("/saveData", (req, res) => {
  const { data, expiryDate, name, accessLogs, isEncrypted } = req.body;

  if (
    !data ||
    !expiryDate ||
    !name
    //  !shortUrl
  ) {
    return res.json({ error: "Please add all the fields" });
  }

  const newData = new Data({
    name: name,
    data: data,
    expiryDate: expiryDate,
    // shortUrl: shortUrl,
    accessLogs: accessLogs,
    isEncrypted: isEncrypted,
  });

  newData
    .save()
    .then((data) => {
      res.status(200).json({ message: "Saved successfully!", data });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error saving data" });
    });
});

router.get("/showAllData", (req, res) => {
  Data.find()
    .then((datas) => {
      res.status(200).json({ datas });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error  : "Something went wrong!" });
    });
});

router.get("/file/:id", (req, res) => {
  Data.findOne({
    _id: req.params.id,
  }).exec((err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong!" });
    } else {
      res.json({ data });
    }
  });
});

router.post("/renewExpiry", (req, res) => {
  const { id, newExpiryAt } = req.body;
  Data.findByIdAndUpdate(
    id,
    {
      expiryDate: newExpiryAt,
    },
    { new: true }
  ).exec((err, doc) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong!" });
    } else {
      console.log(doc);
      res.status(200).json({ message: "Expiry date updated successfully!" });
    }
  });
});

router.post("/deleteFile", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndDelete(id).exec((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong!" });
    } else {
      res.json({ message: "Deleted successfully!" });
    }
  });
});

router.post("/updateLog", (req, res) => {
  const { id, time, ip } = req.body;
  Data.findByIdAndUpdate(
    { _id: id },
    { $push: { accessLogs: { time: time, ip: ip } } }
  ).exec((err, doc) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong!" });
    } else {
      res.json({ doc });
    }
  });
});

router.get("/deleteAllFiles", (req, res) => {
  Data.deleteMany({}).exec((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong!" });
    } else {
      res.json({ message: "Deleted successfully!" });
    }
  });
});

router.get("/getNumberOfFiles", (req, res) => {
  Data.countDocuments({}).exec((err, count) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong!" });
    } else {
      res.json({ count });
    }
  });
});

module.exports = router;

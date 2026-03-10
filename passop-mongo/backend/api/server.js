const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME;

// GET passwords
app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const passwords = await collection.find({}).toArray();
  res.json(passwords);
});

// POST password
app.post("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const result = await collection.insertOne(password);
  res.json({ success: true, result });
});

// DELETE password
app.delete("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const result = await collection.deleteOne(password);
  res.json({ success: true, result });
});

module.exports = app;

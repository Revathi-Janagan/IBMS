const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("../Backend/Helper/db");
require("dotenv").config();
const path = require("path");
const routes = require("../Backend/Routes/index");
const {verifyUserRole,determineUserRole} = require("./Middleware/TokenVerification")

const app = express();
app.use(cors({ origin: "http://localhost:3000", methods: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Port is running on ${PORT}`);
});

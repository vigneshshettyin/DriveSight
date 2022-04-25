require("dotenv").config();
require("./db/Connect").connect();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("./service/jwt");
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
const upload = multer();

app.get("/", (req, res) => {
  res.status(200).json({
    Info: "Night Time Object Detection API",
    Devs: ["Shanwill Pinto", "Simonne Pinto", "Sriganesh", "Vignesh"],
    OS: "Ubuntu Server 20.04 LTS",
    System: "Raspberry Pi 4 Model B",
  });
});

app.post("/api/login", upload.none(), require("./controllers/auth").login);

app.post(
  "/api/register",
  upload.none(),
  require("./controllers/auth").register
);

app.get("/api/auth", jwt, require("./controllers/auth").currentUser);

app.get("/api/status", require("./controllers/status").listAll);

app.get("/api/ping", require("./controllers/status").create);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

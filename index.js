const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const doctors = require("./routes/doctor");
const webhook = require("./routes/webhook");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//connect to db
const uri = process.env.DATABASE_URL;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to Dokita"))
  .catch((err) => {
    console.log(err);
  });

//const connection = mongoose.connection;
//connection.once("open", () => {
//  console.log("MongoDB database connection established successfully");
//});

//base URL
app.use("/dokita/api/v1", auth);
app.use("/dokita/api/v1", doctors);
app.use("/dokita/api/v1", webhook);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});

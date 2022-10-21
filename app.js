const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const dotenv = require("dotenv");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const port = process.env.PORT || 5001;
dotenv.config({ path: "./config.env" });
const url = process.env.DATABASE;
/////SEND FILE////
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/register.html"));
});
let dbLogin;
////SUBMIT FORM///////////

let newForm;

app.post("/formPost", async (req, res) => {
  newForm = req.body;

  await bcrypt.hash(newForm.password, 10, function (err, hashedPass) {
    newForm.password = hashedPass;

    delete newForm.confirmPassword;
    newForm.score = 0;

    dbLogin.collection("users").insertOne(newForm, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });
  });

  res.send(
    `<h4 style="border: solid green ;
        width: 35rem;
        margin: 10rem auto;
        background-color: green;
        color: white;
        font-size: 1.5rem">Felicitari!!!<br/> Ati fost inregistrat cu succes!<br />
        <button class="btn"><a href="http://localhost:5001/">
                Inapoi
           </a></button>
         </h4>`
  );
});

///////VERIFY USER/PASSWORD////////
app.post("/passCompare", async (req, res) => {
  let pendingUser = req.body.userMail;
  let query = { mail: pendingUser };
  let currentUser = await dbLogin.collection("users").find(query).toArray();

  if (!currentUser[0]) {
    res.send({ msg: "no-user" });
  } else {
    bcrypt.compare(
      req.body.userPassword,
      currentUser[0].password,
      function response(err, result) {
        res.send({
          msg: result,
          user: currentUser[0].fullName,
          score: currentUser[0].score,
        });
      }
    );
  }
});
////UPDATE SCORE
app.patch("/updateScore", (req, res) => {
  let updateItem = { fullName: req.body.updateItem };
  let updatedValue = { $set: { score: req.body.value } };
  console.log(updateItem, updatedValue);
  dbLogin
    .collection("users")
    .updateOne(updateItem, updatedValue, function (err, res) {
      if (err) throw err;
    });
  res.send("done");
});
////SERVER//////////

app.listen(port, () =>
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbLogin = db.db("Gess");
    console.log("Listening on port 5001");
  })
);

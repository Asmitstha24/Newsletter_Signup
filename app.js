const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

client.setConfig({
  apiKey: "87113e57d47dd36747d37b80768193fa-us21",
  server: "us21",
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const data = [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    },
  ];

  app.post("/failure", function (req, res) {
    res.redirect("/");
  });

  const run = async () => {
    try {
      const response = await client.lists.batchListMembers("b1128fdfc2", {
        members: data,
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }
  };

  console.log("Before run function");
  run();
  console.log("After run function");
});

app.listen(process.env.PORT, function () {
  console.log("Server started in port 3000");
});

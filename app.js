
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extened: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data ={
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options ={
    url: `https://us2.api.mailchimp.com/3.0/lists/${process.env.listID}`,
    method: "POST",
    body: jsonData,
    headers: {
      "Authorization" : process.env.mailchimpAuth
    }

  };

  request(options, function(error, response, body){
    if(error){
      res.sendFile(__dirname + "/failure.html");
    } else{
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
        console.log(response.statusCode);
      } else{
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });

})

app.post("/failure", function(req, res){
  res.redirect("/");
});

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Server is ruuning at port 3000.");
});



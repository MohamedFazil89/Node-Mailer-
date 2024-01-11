import express from "express";
import nodemailer from "nodemailer"; //step 1: install nodemailer and import it
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // step 2: use express middleware as json()
app.use(express.static("public"));

// step 3: create config set
const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nmohammedfazil790@gmail.com",
    pass: "wbavrcdrblchhyxl",
  },
};
// step 4: create a sendemail function
const sends = (data) => {
  return new Promise((resolve, reject) => {
    const transport = nodemailer.createTransport(config);
    transport.sendMail(data, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info.response);
      }
    });
  });
};
// step 5: render the index.ejs
app.get("/", (req, res) =>{
    res.render("index.ejs");
})

// step 6: send the  data via post and display it

app.post("/api/email", async (req, res) => {
  const { from, to, subject, text } = req.body;

  if (!from || !to || !subject || !text) {
    return res.status(400).send("Missing required fields");
  }

  const mailData = { from, to, subject, text };


  try {
    const response = await sends(mailData);
    res.send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log("Started Server.....");
  console.log(`Server is running on port ${port}`);
});

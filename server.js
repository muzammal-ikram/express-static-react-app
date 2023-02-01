const express = require('express');
const Mailchimp = require('mailchimp-api-v3');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')

const { getMaxListeners } = require('process');
require('dotenv').config();

var mc_api_key = process.env.MAILCHIMP_API_KEY;
var list_id = process.env.MAILING_LIST_ID;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const mailchimp = new Mailchimp(mc_api_key);

app.use(express.static(path.resolve(__dirname, '.', 'build')));
app.use(express.json());

app.get('/api/memberList', (req, res) => {
  mailchimp.get(`/lists/${list_id}/members`)
  .then(function(results){
    res.send(results);
  })
  .catch(function(err){
    res.send(err);
  });
});

app.get('/api/genericCall', (req, res) => {
  let response = {
    msg: "Successful call to /api/genericCall"
  }
  res.send(response);
});

app.post('/api/addMember', async (req, res) => {
  const { firstname, lastname, email } = req.body;
  mailchimp.post(`/lists/${list_id}/members`, {
    email_address : email,
    status : 'subscribed',
    merge_fields: {
                  FNAME: firstname,
                  LNAME: lastname
                },
    email_type: 'text',
  })
  .then(function() {
    res.status(200).json({ success: true });
  })
  .catch(function (err) {
    res.status(500).json({ success: false });
  })
})

//catch all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`express app listening on port ${port}`);

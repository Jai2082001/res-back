const sgMailer = require('@sendgrid/mail');
const express = require('express');
const router = express.Router();
const Twitter = require('twitter');
const { TwitterApi } = require('twitter-api-v2');
const User = require('../models/User');
const { ObjectId } = require('mongodb')

sgMailer.setApiKey(process.env.SENDGRID_KEY)



const tweetMethod = (text) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "OAuth oauth_consumer_key=\"Tw4L0YpkIg3Sxv5hIgsIsMXsf\",oauth_token=\"1772748771404685312-0kveP1p5U8Txt6YYQKpmVkoDO9zHDz\",oauth_signature_method=\"HMAC-SHA1\",oauth_timestamp=\"1732227998\",oauth_nonce=\"sdXWSuu74yX\",oauth_version=\"1.0\",oauth_signature=\"sVVpq78btg2VP1RTxEpqCCt5v2M%3D\"");
  // console.log(text)
  const raw = JSON.stringify({
    "text": text.tweetText
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://api.twitter.com/2/tweets", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}






const msg = {
  to: 'groverjaideep1@gmail.com', // Change to your recipient
  from: 'jaideepgrover147@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

router.post('/api/email/send', (req, res, next) => {
  const { emailList, html } = req.body;

  emailList.map(async (single) => {
    const user = await User.findById({ _id: new ObjectId(single) });
    const msg = {
      to: user.email, // Change to your recipient
      from: 'jaideepgrover147@gmail.com', // Change to your verified sender
      subject: 'Promotion From Gourmet Delights',
      text: 'Gourmet Delights',
      html: html.html,
    }

    sgMailer.send(msg).then((response) => {
      console.log('Email Sent', response)
      res.json({ status: 'EmailSent' });
    }).catch((err) => {
      console.log(err);
      res.send({ status: err })
    })

  })
})

router.post('/api/tweet', (req, res, next) => {
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "OAuth oauth_consumer_key=\"Tw4L0YpkIg3Sxv5hIgsIsMXsf\",oauth_token=\"1772748771404685312-0kveP1p5U8Txt6YYQKpmVkoDO9zHDz\",oauth_signature_method=\"HMAC-SHA1\",oauth_timestamp=\"1732373052\",oauth_nonce=\"urvL3vcm2kR\",oauth_version=\"1.0\",oauth_signature=\"LHQSqJRiQKpCToIiWrP5wmRDsmI%3D\"");
  myHeaders.append("Cookie", "guest_id=v1%3A173237299086891405; guest_id_ads=v1%3A173237299086891405; guest_id_marketing=v1%3A173237299086891405; personalization_id=\"v1_qzg6IAbcDHcKd8ScgHUlmg==\"");
  console.log(req.body)
  const raw = JSON.stringify({
    "text": req.body.tweetText
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("https://api.twitter.com/2/tweets", requestOptions)
    .then((response) => response.text())
    .then((result) => res.send(result))
    .catch((error) => res.send(error));

})


router.get('/email/send', (req, res, next) => {
  console.log("new email")
  sgMailer
    .send(msg)
    .then(() => {
      client.post('statuses/update', { status: tweetText }, function (error, tweet, response) {
        if (error) {
          console.error('Error posting tweet:', error);
        } else {
          console.log('Tweet successfully sent:', tweet);
        }
      });
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })

})


module.exports = router


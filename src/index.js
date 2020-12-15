/** --------------------------- DOTENV INIT --------------------------- */
require('dotenv').config();

/** --------------------------- REQUIRES --------------------------- */
const ClientImp = require('./Classes/Client/client');
const express = require('express');

/** --------------------------- APP INITS --------------------------- */
const port = process.env.PORT || 3000;
const app = express();
const client = new ClientImp(
  process.env.TOKEN, // Long-lived Access Token
  process.env.BASE_PAGE_ID, // FB Business Page
  process.env.BUSINESS_IG_ID, // IG Business Page
  process.env.INITIAL_COMMENT_ID // updates will be replied to this
  ); 

/** --------------------------- SERVER RUN --------------------------- */
app.listen(port, () => {
  console.log(`Server listening on ${port} ...`);
  // set a random interval to repeat function on (perhaps it helps with a more randomised approach ?)
  timers = [60, 70, 72, 66, 77, 75]; // a few random timer intervals
  var randomTimer = timers[Math.floor(Math.random() * timers.length)];  
  // timed app run
  client.runApp(() => {
    setInterval(function() {
      client.runApp(() => {
        // get a new random timer value
        randomTimer = timers[Math.floor(Math.random() * timers.length)];  
      });
    }, randomTimer * 1000);
  });
});



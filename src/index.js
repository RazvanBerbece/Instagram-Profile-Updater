/** --------------------------- DOTENV INIT --------------------------- */
require('dotenv').config();

/** --------------------------- REQUIRES --------------------------- */
const ClientImp = require('./Classes/Client/client');
const express = require('express');

/** --------------------------- APP INITS --------------------------- */
const port = 5001;
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
  // timed app run
  client.runApp(() => {
    setInterval(function() {
      client.runApp(() => {
        // NOTHING HERE -- SILENCE UnhandledPromiseRejectionWarning
      });
    }, 15 * 1000);
  });
});



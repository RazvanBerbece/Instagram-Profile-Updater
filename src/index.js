/** --------------------------- DOTENV INIT --------------------------- */
require('dotenv').config();

/** --------------------------- REQUIRES --------------------------- */
const ClientImp = require('./Classes/Client/client');

/** SERVER RUN */
const client = new ClientImp(process.env.TOKEN, process.env.BASE_PAGE_ID, process.env.BUSINESS_IG_ID);
client.runApp();
/**
 * Client class
 * Manages :
 *  - gets the specified media object
 *  - gets the like count, views, comments etc of the media object
 *  - replies to the specified (owner) comment with the updated metrics
 */

/** --------------------------- REQUIRES --------------------------- */
const axios = require('axios');

class Client {

    constructor(token, basePageID, businessProfileID) {
        this.baseLink = 'https://graph.facebook.com/v9.0';
        this.listeningToIDS = []; // will hold dictionaries with ids, type of media which are being listened to
        this.token = token; // long-term access token (2 months) --- SHOULD FIND A WAY TO REFRESH EVERY 2 MONTHS
        this.basePageID = basePageID; // the id of the business page (used for testing and checking)
        this.businessProfileID = businessProfileID; // id of the IG business profile
    }

    get listenedTo() {
        return this.listeningToIDS;
    }

    /** 
     * Tests the Instagram Graph API by making a simple request for the business page username, id
     * Should match this.basePageID -> true
     * else false
     * Callback => next step in app run (get profile)
     */
    testGraphAPIConnection(callback) {
        var _this = this; // solution to this in .then, as gets lost in the callback
        axios.get(this.baseLink + `/${this.basePageID}` + '?fields=name' + `&access_token=${this.token}`)
        .then(function (response) { // call success handler
            if (_this.basePageID === response.data.id) {
                return callback(1); // Instagram Graph API working properly
            }
            else {
                return callback(0); // Instagram Graph API not working properly
            }
        })
        .catch(function (err) { // call err handler
            console.log(err);
            return callback(0);
        })
    }

    /** 
     * Gets the IG profile 
     * 
     * Callback => next step in app run (get required media object)
    */
    getIGProfile(callback) {
        axios.get(this.baseLink + `/${this.businessProfileID}` + '?fields=name,media' + `&access_token=${this.token}`)
        .then(function (response) {
            callback(response.data.media); // media access is index based
        })
        .catch(function (err) {
            console.log(err);
            callback(undefined);
        })
    }

    /** Runs the App (tests, gets, updates) */
    runApp() {
        this.testGraphAPIConnection((status) => {
            if (status) { // first step successful
                this.getIGProfile((media) => {
                    if (typeof media !== 'undefined') { // second step successful
                        console.log(media);
                    }
                    else {
                        console.log("getIGProfile() error.");
                    }
                });
            }
            else {
                console.log("testGraphAPIConnection() error.");
            }
        })
    }

}

module.exports = Client;
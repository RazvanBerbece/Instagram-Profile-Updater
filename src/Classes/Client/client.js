/**
 * Client class
 * Manages :
 *  - gets the specified media object
 *  - gets the like count, views, comments etc of the media object
 *  - replies to the specified (owner) comment with the updated metrics
 */

/** --------------------------- REQUIRES --------------------------- */
const axios = require('axios');
const dateTime = require('node-datetime');

class Client {

    constructor(token, basePageID, businessProfileID, initialCommentID) {
        this.baseLink = 'https://graph.facebook.com/v9.0';
        this.token = token; // long-term access token (2 months) --- SHOULD FIND A WAY TO REFRESH EVERY 2 MONTHS
        this.basePageID = basePageID; // the id of the business page (used for testing and checking)
        this.businessProfileID = businessProfileID; // id of the IG business profile
        this.initialCommentID = initialCommentID; // id of main comment
    }

    /** 
     * Tests the Instagram Graph API by making a simple request for the business page username, id
     * Should match this.basePageID -> true
     * else false
     * 
     * Callback => second step in app run (get profile)
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
     * Callback => third step in app run (get required media object)
    */
    getIGProfile(callback) {
        axios.get(this.baseLink + `/${this.businessProfileID}` + '?fields=name,media,id' + `&access_token=${this.token}`)
        .then(function (response) {
            callback(response.data.media); // media access is index based
        })
        .catch(function (err) {
            console.log(err);
            callback(0);
        })
    }

    /**
     * Gets the required media object data (like count, replies for now)
     * 
     * Callback => fourth step in app run (get required comment)
     */
    getMediaDataByID(mediaObjID, callback) {
        axios.get(this.baseLink + `/${mediaObjID}` + '?fields=like_count,comments' + `&access_token=${this.token}`)
        .then(function (response) {
            callback(response.data); // media access is index based
        })
        .catch(function (err) {
            console.log(err);
            callback(0);
        })
    }

    /** 
     * Deletes current first reply of to the comment with commentID and replies again to it
     * 
     * Callback => finish app run (reply with new metrics)
    */
    deleteComment(commentID) {
        const _this = this;
        // get current metrics comment data (reply to comment with commentID)
        axios.get(this.baseLink + `/${commentID}` + '/replies' + `?access_token=${this.token}`)
        .then(function (response) { // this get lost here so we use the local _this
            // get metric comment with mention
            response.data.data.forEach((element) => {
                // find the reply with the mention from owner acc
                axios.get(_this.baseLink + `/${_this.businessProfileID}` + `?fields=mentioned_comment.comment_id(${element.id}){text,user{id}}` + `&access_token=${_this.token}`)
                .then(function (response) {
                    if (response.data.mentioned_comment.user.id === _this.businessProfileID) { // found comment from owner
                        // delete comment
                        axios.delete(_this.baseLink + `/${response.data.mentioned_comment.id}` + `?access_token=${_this.token}`)
                        .then(function (deleteResult) {
                            if (deleteResult.data.success == true) {
                                // console.log('Reply deleted.');
                            }
                            else {
                                // console.log("Deleting failed.");
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                        })
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
            });
        })
        .catch(function (err) {
            console.log(err);
        })
    }

    /**
     * Replies to the main comment with the updated metrics (PINNED COMMENT if possible)
     * 
     * callback => end execution of app
     */
    replyWithMetrics(likeCount) {

        // random emoji picker
        const emojiList = ["\u{1F49C}", "\u{1F600}", "\u{1F911}", "\u{1F9E1}",
            "\u{1F49B}", "\u{1F49A}", "\u{1F499}", "\u{1F90E}", "\u{1F5A4}",
            "\u{1F90D}", "\u{1F4AF}", "\u{1F4AB}", "\u{1F4A3}"
        ];
        const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

        // datetime
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');

        const URI = this.baseLink + 
        `/${this.initialCommentID}` + 
        `/replies?message=@_mildlyinterestingstuff_ 
    
        On ${formatted}
        This photo has ${likeCount} ${(likeCount == 0 || likeCount > 1) ? "likes" : "like"} ${randomEmoji}
        
        ` + 
        `&access_token=${this.token}`;
        const encodedURI = encodeURI(URI);
    
        axios.post(encodedURI)
        .then(function (response) {
            // console.log('Reply updated.');
        })
        .catch(function (err) {
            console.log(err);
        })
    }

    /** 
     * Runs the App (tests, gets, updates) 
     * 
     * callback => setInterval with runApp() call ever x seconds
     */
    runApp(callback) {
        this.testGraphAPIConnection((status) => {
            if (status) { // first step successful
                this.getIGProfile((media) => {
                    if (media) { // second step successful
                        this.getMediaDataByID(media.data[0].id, (mediaData) => {
                            if (mediaData) { // third step successful
                                var promise_delete = this.deleteComment(mediaData.comments.data[0].id);
                                var promise_reply = this.replyWithMetrics(mediaData.like_count);
                                Promise.all([promise_delete, promise_reply])
                                .then(() => {
                                    callback()
                                })
                                .catch(() => {
                                    callback();
                                });
                            }
                            else {
                                console.log('getMediaDataByID() error.');
                                callback();
                            }
                        })
                    }
                    else {
                        console.log('getIGProfile() error.');
                        callback();
                    }
                });
            }
            else {
                console.log('testGraphAPIConnection() error.');
                callback();
            }
        })
    }

}

module.exports = Client;
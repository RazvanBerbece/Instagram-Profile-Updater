# Instagram-Profile-Updater

## Summary

Project built in JavaScript (using Node.JS) that based on a Business Instagram Profile media objects (eg: a video) statistics (like count, views, comments etc.), updates a specific reply with the current metrics of the specified media object.

This leads to a behaviour of a continuous automated update of the metrics (no user action required).

Uses the Instagram Graph API.

## Solution Summary
The solution is based on a Client class (src/Classes/Client/client.js) which handles all required operations to do the automated update.
Axios handles API calls to IG Graph API.
Express configures a server which runs the app that updates the metrics based on a set interval of time.

## Used NPs
1. Express (server)
2. dotenv (env variables)
3. axios (Instagram Graph API requesting)

## References
1. Tom Scott [ https://www.youtube.com/watch?v=BxV14h0kFs0&t=14s ]
2. Ben Awad [ https://www.youtube.com/watch?v=RxkLFAGetVQ ] 
3. https://developers.facebook.com/docs/instagram-api/

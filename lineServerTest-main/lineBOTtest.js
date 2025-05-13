'use strict';
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '/config/.env') });

const line = require('@line/bot-sdk');
const express = require('express');
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);
const app = express();
app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
    .catch((err) => {
        console.error(err);
        res.status(500).end(); 
    });
});
function handleEvent(event){
    if(event.type !== 'message' || event.message.type !== 'text')
    {
        return Promise.resolve(null);
    }
    if(event.replyToken==="00000000000000000000000000000000" || event.replyToken==="ffffffffffffffffffffffffffffffff")
    {
        return Promise.resolve(null);
    }
    const echo = { type: 'text', text: event.message.text};
    return client.replyMessage(event.replyToken, echo);
}
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
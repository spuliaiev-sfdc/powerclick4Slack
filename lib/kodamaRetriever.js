const urlHelper = require("./urlHelper");
const urlParser = require("./urlParser");
const url = require('url');
const https = require('https');

const kodamaRetriever = {

  retrieve(info, event, client, context, say) {
    const sayToChat = say;
    const kodamaUrl = urlHelper.generateKodamaUrl(info, true);
    if (kodamaUrl) {
      https.get(kodamaUrl, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          console.log(JSON.parse(data).explanation);
          sayToChat(data);
          // token: context.botToken,
          // ts of message to update
          // ts: event.message_ts,
          // Channel of message
          // channel: event.channel,

        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }
  }
}
// pre-setup with App and config references
module.exports = (app, config) => {
  kodamaRetriever.app = app;
  kodamaRetriever.config = config;
  return kodamaRetriever;
}

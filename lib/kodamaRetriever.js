const urlHelper = require("./urlHelper");
const urlParser = require("./urlParser");
const url = require('url');
const https = require('https');
const request = require('request');

const kodamaRetriever = {

  retrieve(info, furl, event, client, context, say, textOfOldUnfurl) {
    const infoOfUnfurl = info;
    const sayToChat = say;
    const eventToChat = event;
    const contextToChat = context;
    const chatFurl = furl;
    const kodamaUrl = urlHelper.generateKodamaUrl(info, true);
    if (kodamaUrl) {

      request.get({
        url: kodamaUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        rejectUnauthorized: false,//add when working with https sites
        requestCert: false,//add when working with https sites
        agent: false,//add when working with https sites
        form: {
          myfield: "myfieldvalue"
        }
      },function (response, err, body){
        if (body) {
          console.log(JSON.parse(body).explanation);
          const kodamaInfo = JSON.parse(body);

          if (kodamaInfo && kodamaInfo.length > 0) {
            let text = kodamaRetriever.generateKodamaText(infoOfUnfurl, kodamaInfo[0]);
            let furls = {
              chatFurl: {
                "blocks": [
                  {
                    "type": "section",
                    "text": {
                      "type": "mrkdwn",
                      "text": textOfOldUnfurl + text
                    }
                  }
                ]
              }
            };
            const resultUnfurl = kodamaRetriever.app.client.chat.unfurl({
              token: contextToChat.botToken,
              // ts of message to update
              ts: eventToChat.message_ts,
              // Channel of message
              channel: eventToChat.channel,
              "unfurls": furls
            });
            console.log("unfurled", resultUnfurl);

          } else {
            console.warn("Kodama request has failed", err);
          }
        } else {
          console.warn("Kodama request has failed", err);
        }
      }.bind(this));
    }
  },
  generateKodamaText(infoOfUnfurl, kodamaInfo) {
    let response = "\n*Kodama Response:*";
    let owningTeam = kodamaInfo.owningTeam;
    response += `
    *OwningTeam:* <${owningTeam.homepageUrl}|${owningTeam.name}> from cloud ${owningTeam.cloud}
    *Full path*: <${kodamaInfo.urlToSource}|${kodamaInfo.sourceInformation}>
`;
    return response;
  }
}
// pre-setup with App and config references
module.exports = (app, config) => {
  kodamaRetriever.app = app;
  kodamaRetriever.config = config;
  return kodamaRetriever;
}

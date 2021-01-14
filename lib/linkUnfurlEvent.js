const urlHelper = require("./urlHelper");
const urlParser = require("./urlParser");
const url = require('url');

const linkUnfurlEvent = {

  async process({ event, client, context, say }) {
    console.log("Event received link_shared", event);
    // console.log("Event received link_shared, Client", client);

    try {
      let furls = {};
      for (let lnkInd in event.links) {
        let linkData = event.links[lnkInd];
        let info = linkUnfurlEvent.parseInformation(linkData);
        let text = linkUnfurlEvent.generateText(info);
        linkUnfurlEvent.kodamaRetriever.retrieve(info, linkData.url, event, client, context, say, text);
        furls[linkData.url] = {
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": text
              }
            }
          ]
        };
      }
      const resultUnfurl = await linkUnfurlEvent.app.client.chat.unfurl({
        token: context.botToken,
        // ts of message to update
        ts: event.message_ts,
        // Channel of message
        channel: event.channel,
        "unfurls": furls
      });
      console.log("UNFURL:", resultUnfurl);
    } catch (error) {
      console.error(error);
    }
  },

  generateText(info) {
    let text = `Detected domain ${info.domain}`;
    if (info.domainName) {
      text += " from "+info.domainName;
    }
    text += "\n";
    text += urlHelper.generateWorkItemLink(info);
    text += urlHelper.generateIntelliJ(info);
    text += urlHelper.generateSwarm(info);
    text += urlHelper.generateKodamaUrl(info);
    text += urlHelper.generateATM(info);

    // text += "\n\n```"+JSON.stringify(info, null, 2)+"```";

    return text;
  },

  parseInformation(linkData) {
    let info = {
      url: linkData.url,
      domain: linkData.domain
    };
    try {
      info.request = url.parse(linkData.url,true);
    } catch (e) {
      console.warn("Failed to parse URL for "+linkData.url, e);
    }

    if (info.request.host === "kodama.eng.sfdc.net") {
      info.domainName = "Kodama";
      urlParser.parseKodama(info, linkData);
    }
    if (info.request.host === "portal.prod.ci.sfdc.net") {
      info.domainName = "ATM";
      urlParser.parseATMLink(info, linkData);
    }
    if (info.request.host === "swarm.soma.salesforce.com") {
      info.domainName = "SWARM";
      urlParser.parseSwarm(info, linkData);
    }
    if (info.request.host === "codesearch.data.sfdc.net") {
      info.domainName = "CodeSearch";
    }
    if (info.request.host === "gus.my.salesforce.com") {
      info.domainName = "Old GUS";
      urlParser.parseOldGusLink(info, linkData);
    }
    if (info.request.host === "gus.lightning.force.com") {
      info.domainName = "GUS";
      urlParser.parseGusLink(info, linkData);
    }

    return info;
  }
};

// pre-setup with App and config references
module.exports = (app, config) => {
  linkUnfurlEvent.app = app;
  linkUnfurlEvent.config = config;
  linkUnfurlEvent.kodamaRetriever = require ('./kodamaRetriever.js')(app, config);
  return linkUnfurlEvent;
}

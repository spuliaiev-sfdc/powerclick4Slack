const urlHelper = require("./urlHelper");

const linkUnfurlEvent = {

  async process({ event, client, context, say }) {
    console.log("Event received link_shared", event);
    // console.log("Event received link_shared, Client", client);

    try {

      let furls = {};
      for (let lnkInd in event.links) {
        let linkData = event.links[lnkInd];
        let urlData = linkUnfurlEvent.parseInformation(linkData);
        let text = linkUnfurlEvent.generateText(urlData);
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
      const result = await linkUnfurlEvent.app.client.chat.unfurl({
        token: context.botToken,
        // ts of message to update
        ts: event.message_ts,
        // Channel of message
        channel: event.channel,
        "unfurls": furls
      });
      console.log("UNFURL:", result);
    } catch (error) {
      console.error(error);
    }
  },

  generateText(info) {
    let text = `Detected domain ${info.domain}`;
    if (info.domainName) {
      text += " from "+info.domainName;
    }
    if (info.workitem) {
      text += " Work "+ urlHelper.generateWorkItemLink(info.workitem);
    }
    return text;
  },


  parseInformation(linkData) {
    let info = {
      url: linkData.url,
      domain: linkData.domain
    };
    if (linkData.domain === "kodama.eng.sfdc.net") {
      info.domainName = "Kodama";
    }
    if (linkData.domain === "swarm.soma.salesforce.com") {
      info.domainName = "SWARM";
    }
    if (linkData.domain === "codesearch.data.sfdc.net") {
      info.domainName = "CodeSearch";
    }
    if (linkData.domain === "gus.my.salesforce.com") {
      info.domainName = "Old GUS";
      if (linkData.url.indexOf("bugorworknumber=") > 0) {
        let off = linkData.url.indexOf("bugorworknumber=");
        info.workitem = linkData.url.substr(off+"bugorworknumber=".length).trim();
      }
    }
    if (linkData.domain === "gus.lightning.force.com") {
      info.domainName = "GUS";
      if (linkData.url.indexOf("/lightning/r/ADM_Work__c/a07") >= 0) {
        // Link to work item detected

      }
    }

    return info;
  }
};

// pre-setup with App and config references
module.exports = (app, config) => {
  linkUnfurlEvent.app = app;
  linkUnfurlEvent.config = config;
  return linkUnfurlEvent;
}

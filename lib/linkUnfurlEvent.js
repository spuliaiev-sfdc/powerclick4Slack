const linkUnfurlEvent = {

  async process({ event, client, context }) {
    console.log("Event received link_shared", event);
    // console.log("Event received link_shared, Client", client);

    try {

      let furls = {};
      for (let lnkInd in event.links) {
        let linkData = event.links[lnkInd];
        let text = linkUnfurlEvent.generateText(linkData);
        furls[linkData.url] = {
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": text
              }
            } /* ,
            {
              "type": "actions",
              "elements": [
                {
                  "type": "button",
                  action_id: 'button_abc',
                  "text": {
                    "type": "plain_text",
                    "text": "Click me ABC!"
                  }
                }
              ]
            } */
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

  generateText(linkData) {
    let text = `Detected domain ${linkData.domain}`;
    if (linkData.url.toLowerCase().startsWith("http://kodama.eng.sfdc.net")) {


    }
    return text;
  }
};

// pre-setup with App and config references
module.exports = (app, config) => {
  linkUnfurlEvent.app = app;
  linkUnfurlEvent.config = config;
  return linkUnfurlEvent;
}
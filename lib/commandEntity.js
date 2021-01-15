const urlParser = require("./urlParser");

const commandEntity = {

  async process({ ack, payload, context, say }) {
    console.log("Command received helloworld");
    // Acknowledge the command request
    await ack();

    try {
      let info = {
        entityName: payload.text
      }
      let result = commandEntity.kodamaRetriever.retrieve(info,
        (info, kodamaInfo) => {
          let text = commandEntity.generateText(info);
          const resultPost = commandEntity.app.client.chat.postMessage({
            token: context.botToken,
            // Channel to send message to
            channel: payload.channel_id,
            // Include a button in the message (or whatever blocks you want!)
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: text
                }
              }
            ],
            // Text in the notification
            text: 'Message from Test App'
          });
          console.log("resultPost", resultPost);
        });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  },

  generateText(info) {
    let text = "";
    text += urlHelper.generateWorkItemLink(info);
    text += urlHelper.generateIntelliJ(info);
    text += urlHelper.generateSwarm(info);
    text += urlHelper.generateKodamaUrl(info);
    text += urlHelper.generateATM(info);
    text += urlHelper.generateCodeSearch(info);

    text += urlHelper.generateOwnership(info);

    // text += "\n\n```"+JSON.stringify(info, null, 2)+"```";

    return text;
  },

};

// pre-setup with App and config references
module.exports = (app, config) => {
  commandEntity.app = app;
  commandEntity.config = config;
  commandEntity.kodamaRetriever = require ('./kodamaRetriever.js')(app, config);
  return commandEntity;
}

const urlParser = require("./urlParser");
const urlHelper = require("./urlHelper");

const commandJavaClass = {

  async process({ ack, payload, context, say }) {
    console.log("Command received helloworld");
    // Acknowledge the command request
    await ack();

    try {
      let info = {
        raw: payload.text
      }
      urlParser.parseClassFQN(info, payload.text);
      let result = commandJavaClass.kodamaRetriever.retrieve(info,
        (info, kodamaInfo) => {
          let text = commandJavaClass.generateText(info);
          const resultPost = commandJavaClass.app.client.chat.postMessage({
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
    let text = `Request about java class \`${info.raw}\`\n\n`;
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
  commandJavaClass.app = app;
  commandJavaClass.config = config;
  commandJavaClass.kodamaRetriever = require ('./kodamaRetriever.js')(app, config);
  return commandJavaClass;
}

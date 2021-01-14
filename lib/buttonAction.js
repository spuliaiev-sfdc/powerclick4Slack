const buttonAction = {

  async process({ ack, body, context, say }) {
    // Acknowledge the button request
    console.log("Acttion received button_abc");
    await ack();

    try {
      // Update the message
      if (body.message) {
        console.log("Action received button_abc - updating message");
        const result = await buttonAction.app.client.chat.update({
          token: context.botToken,
          // ts of message to update
          ts: body.message.ts,
          // Channel of message
          channel: body.channel.id,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*The button was clicked!*'
              }
            }
          ],
          text: 'Message from Test App'
        });
        console.log(result);
      } else {
        console.log("Action received button_abc - message is missing");
        const result = { "error": "Message is missing - no updates" };
        console.log(result);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

};

// pre-setup with App and config references
module.exports = (app, config) => {
  buttonAction.app = app;
  buttonAction.config = config;
  return buttonAction;
}

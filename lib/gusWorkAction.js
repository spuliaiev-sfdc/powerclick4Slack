const gusWorkAction = {

  async process({ ack, payload, context }) {
    console.log(`Command received gusWorkAction with ${payload.text}`);
    // Acknowledge the command request
    await ack();

    try {
      const result = await gusWorkAction.app.client.chat.postMessage({
        token: context.botToken,
        // Channel to send message to
        channel: payload.channel_id,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Click to get to the GUS Work Item <https://gus.my.salesforce.com/apex/ADM_WorkLocator?bugorworknumber=${payload.text}|${payload.text}>`
            }
          }
        ],
        // Text in the notification
        text: 'Message from Test App'
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  }

};

// pre-setup with App and config references
module.exports = (app, config) => {
  gusWorkAction.app = app;
  gusWorkAction.config = config;
  return gusWorkAction;
}

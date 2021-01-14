const commandHelloWorld = {

  async process(app, config, ack, payload, context ) {
    console.log("Command received helloworld");
    // Acknowledge the command request
    await ack();

    try {
      const result = await app.client.chat.postMessage({
        token: context.botToken,
        // Channel to send message to
        channel: payload.channel_id,
        // Include a button in the message (or whatever blocks you want!)
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Go ahead. Click it.'
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click me!'
              },
              action_id: 'button_abc'
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

module.exports = commandHelloWorld;

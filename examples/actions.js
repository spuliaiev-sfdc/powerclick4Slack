// This example shows how to listen to a button click
// It uses slash commands and actions
// Require the Bolt package (github.com/slackapi/bolt)
const { App, ExpressReceiver } = require('@slack/bolt');

// Create a Bolt Receiver
// const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
const version = '0.0.1';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
  // receiver
});

// Other web requests are methods on receiver.router
// receiver.router.get('/', (req, res) => {
//   You're working with an express req and res now.
  // console.log("ROOT Request");
  // res.send(`This is Slackathon PowerClick Slack App version ${version}`);
// });

// Listen for a slash command invocation
app.command('/helloworld', async ({ ack, payload, context }) => {
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
});

// Listen for a button invocation with action_id `button_abc`
// You must set up a Request URL under Interactive Components on your app configuration page
app.action('button_abc', async ({ ack, body, context }) => {
  // Acknowledge the button request
  console.log("Acttion received button_abc");
  await ack();

  try {
    // Update the message
    if (body.message) {
      console.log("Action received button_abc - updating message");
      const result = await app.client.chat.update({
        token: context.botToken,
        // ts of message to update
        ts: body.message ? body.message.ts : body.actions?body.actions[0].action_ts : 0,
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
});

// Listen for a link_shared event invocation
app.event('link_shared', async ({ event, client, context }) => {
  console.log("Event received link_shared", event);
  // console.log("Event received link_shared, Client", client);

  try {

    let furls = {};
    for (let lnkInd in event.links) {
      let linkData = event.links[lnkInd];
      furls[linkData.url] = {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `Detected domain ${linkData.domain}`
            },
            "accessory": {
              "type": "image",
              "image_url": "https://gentle-buttons.com/img/carafe-filled-with-red-wine.png",
              "alt_text": "Stein's wine carafe"
            }
          },
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
          }
        ]
      };
    }
    const result = await app.client.chat.unfurl({
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
});


app.event('app_home_opened', async ({ event, client, context }) => {
  console.log("Event received app_home_opened");
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Welcome to your _App's Home_* :tada:"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app."
            }
          },
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
          }
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error('ERROR IN APP WORK', error);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app Actions is running!');
})();

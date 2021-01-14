// This example shows how to listen to a button click
// It uses slash commands and actions
// Require the Bolt package (github.com/slackapi/bolt)
const { App, ExpressReceiver } = require('@slack/bolt');
const configReader = require("./lib/configReader")

// Create a Bolt Receiver
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
const version = '0.0.1';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

const config = configReader.readConfig();

// Other web requests are methods on receiver.router
receiver.router.get('/', (req, res) => {
//   You're working with an express req and res now.
  console.log("ROOT Request");
  res.send(`This is Slackathon PowerClick Slack App version ${version} Running in HEROKU`);
});

// Listen for a slash command invocation

app.command('/work', require ('./lib/gusWorkAction.js')(app, config).process);

// You must set up a Request URL under Interactive Components on your app configuration page
app.action('button_abc', require('./lib/buttonAction.js')(app, config).process);

// Listen for a link_shared event invocation
app.event('link_shared', require ('./lib/linkUnfurlEvent.js')(app, config).process);

app.event('app_home_opened', require ('./lib/appHomeEvent.js')(app, config).process);

app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error('ERROR IN APP WORK', error);
});

(async () => {
  // Start your app
  const port = process.env.PORT || 3000;
  console.log(`Starting app on port ${port}`);
  await app.start(port);

  console.log('⚡️ Bolt app Actions is running!');
})();

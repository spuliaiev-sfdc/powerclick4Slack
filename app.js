// This example shows how to listen to a button click
// It uses slash commands and actions
// Require the Bolt package (github.com/slackapi/bolt)
const version = '0.0.2';
// modeSocket:
// true  for Socket app
// false for Events app
const modeSocket = true;

const { App, ExpressReceiver, LogLevel, SocketModeReceiver } = require('@slack/bolt');
const configReader = require("./lib/configReader")
// Create a Bolt Receiver for Events
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});
// Create a Bolt Receiver for Socket mode
const socketModeReceiver = new SocketModeReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_SOCKET_APP_TOKEN,
  appToken: process.env.SLACK_SOCKET_APP_TOKEN
});

const app = new App({
  receiver: modeSocket? socketModeReceiver : receiver,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_SOCKET_APP_TOKEN
});

const config = configReader.readConfig();

if (!modeSocket) {
  // Other web requests are methods on receiver.router
  receiver.router.get('/', (req, res) => {
    //   You're working with an express req and res now.
    console.log("ROOT Request");
    res.send(`This is Slackathon PowerClick Slack App version ${version} Running in LOCAL`);
  });
}

// Listen for a slash command invocation

app.command('/work', require ('./lib/gusWorkAction.js')(app, config).process);

app.command('/helloworld', require ('./lib/commandHelloWorld.js')(app, config).process);

app.command('/entity', require ('./lib/commandEntity.js')(app, config).process);

app.command('/javaclass', require ('./lib/commandJavaClass.js')(app, config).process);

// You must set up a Request URL under Interactive Components on your app configuration page
app.action('button_abc', require('./lib/buttonAction.js')(app, config).process);

// Listen for a link_shared event invocation
app.event('link_shared', require ('./lib/linkUnfurlEvent.js')(app, config).process);

app.event('app_home_opened', require ('./lib/appHomeEvent.js')(app, config).process);

app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error('ERROR IN APP WORK', error);
});

const port = process.env.PORT || 3000;

(async () => {
  // Start your app
  if (modeSocket) {
    console.log(`Starting Socket app on port ${port}`);
  } else {
    console.log(`Starting Events app on port ${port}`);
  }
  await app.start(port);

  console.log('⚡️ Bolt app Actions is running!');
})();

const appHomeEvent = {

  async process({ event, client, context }) {
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
                "text": "*Welcome to your _App's Home_* :tada: in the LOCAL New 3 !!"
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
    } catch (error) {
      console.error(error);
    }
  }

};

// pre-setup with App and config references
module.exports = (app, config) => {
  appHomeEvent.app = app;
  appHomeEvent.config = config;
  return appHomeEvent;
}

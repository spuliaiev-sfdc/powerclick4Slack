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
                "text": `
*Welcome to your PowerClick for Slack!!!*                
`
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                // language=Markdown
                "text": `
This extension is adding support of PowerClick for Salesforce into Slack.
It allows to catch the URL mentioned in the channel leading to some Salesforce systems and provide additional references to other systems.


*List of supported systems:*
* <https://portal.prod.ci.sfdc.net/|Automation Portal>
* <https://swarm.soma.salesforce.com|SWARM>
* <https://codesearch.data.sfdc.net/source/|CodeSearch>
* <https://kodama.eng.sfdc.net/|KODAMA>
* <https://www.jetbrains.com/idea/|IntelliJ IDE> ( <https://gus.lightning.force.com/lightning/r/CollaborationGroup/0F9B000000000GnKAI/view|GUS Support group>)



*References:*

* *PowerClick for Browsers* <https://git.soma.salesforce.com/pages/intellij/powerclick/#browser_menu|See how to use>
    Drag the bookmarklet from the web site to your browser bookmarks bar to use it for different salesforce web tools!

* *PowerClick for IntelliJ* <https://git.soma.salesforce.com/pages/intellij/powerclick/#intelliJ_menu|See how to use>
    Click on this link to automatically install it into the IntelliJ IDE! <http://localhost:63342/api/installPlugin?action=install&pluginId=com.salesforce.powerclick|Install>  

* *PowerClick for Slack* <https://github.com/spuliaiev-sfdc/powerclick4Slack|Git Repository>
`
              }
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

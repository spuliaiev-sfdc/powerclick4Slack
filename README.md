Bolt app template
=================

[Bolt](https://slack.dev/bolt) is our framework that lets you build JavaScript-based Slack apps in a flash.

This project is a simple app template to make it easy to create your first Bolt app. Read our [Getting Started with Bolt](https://api.slack.com/start/building/bolt) guide for a more in-depth tutorial

Your Project
------------

- `app.js` contains the primary Bolt app. It imports the Bolt package (`@slack/bolt`) and starts the Bolt app's server. It's where you'll add your app's listeners.
- `.env` is where you'll put your Slack app's authorization token and signing secret.
- The `examples/` folder contains a couple of other sample apps that you can peruse to your liking. They show off a few platform features that your app may want to use.


Read the [Getting Started guide](https://api.slack.com/start/building/bolt)
-------------------

Read the [Bolt documentation](https://slack.dev/bolt)
-------------------


Debug in  InteliiJ
-------------------
Add new Node Application with the following parameters:
* Node interpreter (Add as Local):
  `node_modules/.bin/nodemon`
* Node parameters:
  
  `--inspect-brk`
* Javascript:
  
  `app.js`
  
And RUN this configuration.

Add another configuration:
* type:
  
    `Attach to NodeJS/Chrome`
* Reconnect automatically:
  
    `Yes`

And Run it connect with debug support - it will reconnect when nodemon restarts to accommodate your files changes!


## How to setup Slack APP

### Socket Mode
  Go to 'Socket Mode' and enable the Socket Mode

### Basic Information
1.  Go to 'Basic Information' and save the value of Signing Secret from section Basic Information :
  `Signing Secret`
  to put into variable **SLACK_SIGNING_SECRET**
    

2. Generate 'App-Level Tokens' with some name, like 'PowerClickToken' and Scope=connections:write
   Save it's value to put into variable **SLACK_SOCKET_APP_TOKEN**

   
3. Set in the 'Display Information' values:
  * **App name** = PowerClick4Slack
  * **Short description** = Salesforce PowerClick for Slack
  * **Background color** = #3855ab


### Slash Commands configuration 
  Go to 'Slash Commands' and configure the following Commands:
1. **/work**
  * Description: Renders URL to open Work Item in GUS
  * Hint: W-1234554   
2. **/entity**
  * Description: Find entity information
  * Hint: Account   
3. **/javaclass**
  * Description: Identifies the java class 
  * Hint: Account.getSfdcAccountElement:112

### Home Tab Configuration
1. Go to 'App Home Section' and enable Home Tab

   
2. Set the 'App Display Name' to
   `PowerClick4Slack`
   

3. Set the 'Default username' to
   `PowerClick`

### Interactivity & Shortcuts configuration
  Go to 'Interactivity & Shortcuts' and enable it  

### OAuth & Permissions configuration
  Go to 'OAuth & Permissions' and add the following scopes:
* app_mentions:read
* chat:write
* commands
* im:read
* im:write
* links:read
* links:write

### Event Subscriptions configuration
1.  Go to 'Event Subscriptions' and enable it
    

2. Subscribe bot for the following events:
* app_home_opened
* link_shared

3. Add the following domains for section 'App unfurl domains'
* swarm.soma.salesforce.com
* codesearch.data.sfdc.net
* sfdc.net
* gus.my.salesforce.com
* gus.lightning.force.com

### Install App into workspace
  Save the value of 
  `Bot User OAuth Access Token`
  to put into variable **SLACK_BOT_TOKEN**

### Use your saved credentials for app
Copy the saved values into the execution configuration for your NodeJS app:
* **SLACK_SIGNING_SECRET**
* **SLACK_SOCKET_APP_TOKEN**
* **SLACK_BOT_TOKEN**

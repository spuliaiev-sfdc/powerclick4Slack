const urlHelper = require("./urlHelper");
const urlParser = require("./urlParser");
const url = require('url');
const https = require('https');
const request = require('request');

const kodamaRetriever = {

  retrieve(info, furl, event, client, context, say, textOfOldUnfurl) {
    const infoOfUnfurl = info;
    const sayToChat = say;
    const eventToChat = event;
    const contextToChat = context;
    const chatFurl = furl;
    const kodamaUrl = urlHelper.generateKodamaUrl(info, true);
    if (kodamaUrl) {

      request.get({
        url: kodamaUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        rejectUnauthorized: false,//add when working with https sites
        requestCert: false,//add when working with https sites
        agent: false,//add when working with https sites
        form: {
          myfield: "myfieldvalue"
        }
      },function (response, err, body){
        if (body) {
          console.log(JSON.parse(body).explanation);
          let kodamaInfo = JSON.parse(body);
          if (kodamaInfo && kodamaInfo.length && kodamaInfo.length > 0) {
            kodamaInfo = kodamaInfo[0];
          }
          if (kodamaInfo) {
            let text = kodamaRetriever.generateKodamaText(infoOfUnfurl, kodamaInfo, textOfOldUnfurl);
            let furls = {};
            furls[chatFurl] = {
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": text
                  }
                }
              ]
              };
            const resultUnfurl = kodamaRetriever.app.client.chat.unfurl({
              token: contextToChat.botToken,
              // ts of message to update
              ts: eventToChat.message_ts,
              // Channel of message
              channel: eventToChat.channel,
              "unfurls": furls
            });
            console.log("unfurled", resultUnfurl);

          } else {
            console.warn("Kodama request has failed 1", err);
          }
        } else {
          console.warn("Kodama request has failed 2", err);
        }
      }.bind(this));
    }
  },

  generateKodamaText(info, kodamaInfo, textOfOldUnfurl) {
    // There are two different results -
    // 1) incomplete which is returned for /search/java-class
    // 2) complete   which is returned for /file-detail

    // Parsing result for /search/java-class
    if (kodamaInfo.urlToSource) {
      // see ATM https://portal.prod.ci.sfdc.net/testhistory?pageType=history&testId=336647394&testClass=common.api.soap.test.PublicWsdlSuiteTest&testName=testEnterprisePublicWsdl_ComplexType_SharingRecordCollectionMemberOwnerSharingRule_urn:sobject.enterprise.soap.sforce.com
    } else {
      //See CodeSearch https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/conversation-impl/java/src/conversation/calllibrary/SharingRecordCollectionFunctions.java#52
    }
    if (kodamaInfo.p4Path && !info.fileFull) {
      info.fileFull = kodamaInfo.p4Path;
      urlParser.parseFullFileLocator(info);
    }
    if (kodamaInfo.modulePath && !info.module) {
      info.module = kodamaInfo.modulePath;
    }
    if (kodamaInfo.owningTeam) {
      info.owningTeam = kodamaInfo.owningTeam;
    }
    if (kodamaInfo.moduleId) {
      info.moduleId = kodamaInfo.moduleId;
    }

    return kodamaRetriever.linkUnfurlEvent.generateText(info);
  }
}
// pre-setup with App and config references
module.exports = (app, config, linkUnfurlEvent) => {
  kodamaRetriever.app = app;
  kodamaRetriever.config = config;
  kodamaRetriever.linkUnfurlEvent = linkUnfurlEvent;
  return kodamaRetriever;
}

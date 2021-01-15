const urlHelper = require("./urlHelper");
const urlParser = require("./urlParser");
const url = require('url');
const https = require('https');
const request = require('request');

const kodamaRetriever = {

  retrieve(info, callBack) {
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
            kodamaRetriever.updateNewInfo(info, kodamaInfo);
            callBack(info, kodamaInfo);
          } else {
            console.warn("Kodama request has failed 1", err);
          }
        } else {
          uthconsole.warn("Kodama request has failed 2", err);
        }
      }.bind(this));
    } else {
      if (info.entityName) {
        request.post({
          url: `https://kodama.eng.sfdc.net/api/v1/search/`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          rejectUnauthorized: false,//add when working with https sites
          requestCert: false,//add when working with https sites
          agent: false,//add when working with https sites
          form: {
            rawText: info.entityName
          }
        },function (response, err, body){
          if (body) {
            console.log(JSON.parse(body).explanation);
            let kodamaInfo = JSON.parse(body);
            if (kodamaInfo && kodamaInfo.length && kodamaInfo.length > 0) {
              kodamaInfo = kodamaInfo[0];
            }
            if (kodamaInfo) {
              callBack(info, kodamaInfo);
            } else {
              console.warn("Kodama request has failed 1", err);
            }
          } else {
            console.warn("Kodama request has failed 2", err);
          }
        }.bind(this));
      }
    }
  },

  updateNewInfo(info, kodamaInfo) {
    // There are two different results -
    // 1) incomplete which is returned for /search/java-class
    // 2) complete   which is returned for /file-detail

    // Parsing result for /search/java-class
    if (kodamaInfo.urlToSource) {
      // see AutomationPortal https://portal.prod.ci.sfdc.net/testhistory?pageType=history&testId=336647394&testClass=common.api.soap.test.PublicWsdlSuiteTest&testName=testEnterprisePublicWsdl_ComplexType_SharingRecordCollectionMemberOwnerSharingRule_urn:sobject.enterprise.soap.sforce.com
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
  }
}
// pre-setup with App and config references
module.exports = (app, config) => {
  kodamaRetriever.app = app;
  kodamaRetriever.config = config;
  return kodamaRetriever;
}

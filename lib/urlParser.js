const fileParser = RegExp("^\\/\\/app\\/(?<project>(main|[0-9]+\\/[^\\/]+))\\/core\\/(?<pathincore>(?<path>.*)?\\/(?<class>[^\\/]+)\\.java(?<line>#[0-9]+)?)$");
const filePackage = RegExp("^(?<module>[^\\/]+)\\/(java\\/src|(?<submodule>(?!java)[^\\/]+))\\/(?<package>.*).*$");
const classParser = RegExp("^((?<package>.*)?\\.)?(?<class>[^.]+)$");

const urlParser = {

  parseOldGusLink(info, linkData) {
    const prefix = "bugorworknumber=";

    // Work Item https://gus.my.salesforce.com/apex/ADM_WorkLocator?bugorworknumber=W-7882440
    if (linkData.url.indexOf(prefix) > 0) {
      let off = linkData.url.indexOf(prefix);
      info.workitem = linkData.url.substr(off+prefix.length).trim();
    }
  },

  parseATMLink(info, linkData) {
    // https://portal.prod.ci.sfdc.net/testhistory?autobuildId=4098&testClass=conversation.calllibrary.SharingRecordCollectionFunctions&testName=saveHook_PostStmtExecuteOnce
    // https://portal.prod.ci.sfdc.net/testhistory?pageType=history&testId=320607084&testClass=common.api.publicentitytest.PublicApiEntityTestApex&testName=testApex51.0_AuthApplicationPlace
    if (info.request.pathname === "/testhistory") {
      let classFQN = info.request.query.testClass || info.request.query["amp;testClass"];
      urlParser.parseClassFQN(info, classFQN);
      info.testMethod = info.request.query.testName || info.request.query["amp;testName"];
      info.method = info.testMethod.replace(/(\[[^]]\]|:.*$)/g,"");
    }
    // https://portal.prod.ci.sfdc.net/testfailures/bughandlerreport?bugNumber=W-8269157
    if (info.request.pathname === "/testfailures/bughandlerreport") {
      info.workitem = info.request.query.bugNumber;
    }
  },

  parseGusLink(info, linkData) {
    // Work Item https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008Wc38IAC/view
    const prefix = "/lightning/r/ADM_Work__c/a07";
    if (linkData.url.indexOf(prefix) > 0) {
      let off = linkData.url.indexOf(prefix);
      // extract only 15 - as it might be short version of ID
      info.workitemId = linkData.url.substr(off+prefix.length-3,15).trim();
    }
  },

  parseCodeSearch(info, linkData) {
    // https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/conversation-impl/java/src/conversation/calllibrary/SharingRecordCollectionFunctions.java#52
    let prefix = "/source/xref/";
    let prefixOffset = linkData.url.indexOf(prefix);
    if (prefixOffset > 0) {
      let postPrefixOffset = linkData.url.indexOf("/", prefixOffset+prefix.length+1);
      info.fileFull = "/"+linkData.url.substr(postPrefixOffset).trim();
      urlParser.parseFullFileLocator(info);
    }
  },

  parseSwarm(info, linkData) {
    // https://swarm.soma.salesforce.com/files//app/main/core/conversation-impl/java/src/conversation/calllibrary/SharingRecordCollectionFunctions.java#52
    let prefix = "/files/";
    let prefixOffset = linkData.url.indexOf(prefix);
    if (prefixOffset > 0) {
      info.fileFull = linkData.url.substr(prefixOffset+prefix.length).trim();
      urlParser.parseFullFileLocator(info);
    }

    // https://swarm.soma.salesforce.com/changes/28248524
    prefix = "/changes/";
    prefixOffset = linkData.url.indexOf(prefix);
    if (prefixOffset > 0) {
      info.changeList = linkData.url.substr(prefixOffset+prefix.length).trim();
    }

    // https://swarm.soma.salesforce.com/reviews/28780903
    prefix = "/reviews/";
    prefixOffset = linkData.url.indexOf(prefix);
    if (prefixOffset > 0) {
      info.review = linkData.url.substr(prefixOffset+prefix.length).trim();
    }
  },

  parseKodama(info, linkData) {
    // https://kodama.eng.sfdc.net/api/v1/file-detail/p4-path/%2F%2Fapp%2Fmain%2Fcore%2Fui-services-private%2Fjava%2Fsrc%2Fui%2Fservices%2Finternal%2Futils%2Fimpl%2FLayoutUtilImpl.java
    let prefix = "/api/v1/file-detail/p4-path/";
    let prefixOffset = linkData.url.indexOf(prefix);
    if (prefixOffset > 0) {
      info.fileFull = linkData.url.substr(prefixOffset+prefix.length).trim();
      info.fileFull = decodeURIComponent(info.fileFull);
      urlParser.parseFullFileLocator(info);
    }
  },

  parseFullFileLocator(info) {
    // example //app/main/core/conversation-impl/java/src/conversation/calllibrary/SharingRecordCollectionFunctions.java#52
    const parts = fileParser.exec(info.fileFull);
    if (parts.groups) {
      if (parts.groups.line) {
        info.lineNumber = parts.groups.line.replace(/#/, "");
      }
      if (parts.groups.project) {
        info.project = parts.groups.project;
      }
      if (parts.groups.pathincore) {
        info.pathInCore = parts.groups.pathincore;
      }
      if (parts.groups.path) {
        info.path = parts.groups.path;
        // extract package
        const packageInfo = filePackage.exec(info.path);
        if (packageInfo.groups) {
          if (packageInfo.groups.module) {
            info.module = packageInfo.groups.module;
          }
          if (packageInfo.groups.submodule) {
            info.submodule = packageInfo.groups.submodule;
          }
          if (packageInfo.groups.package) {
            info.package = packageInfo.groups.package.replace(/\//g, ".");
          }
        } else {
          console.warn("Package not identified ", info);
        }
      }
      if (parts.groups.class) {
        info.class = parts.groups.class;
      }
    } else {
      console.warn("URL is wrong ", info);
    }
  },

  parseClassFQN(info, classFQN) {
    // example conversation.calllibrary.SharingRecordCollectionFunctions
    const parts = classParser.exec(classFQN);
    if (parts.groups) {
      if (parts.groups.package) {
        info.package = parts.groups.package;
      }
      if (parts.groups.class) {
        info.class = parts.groups.class;
      }
    } else {
      console.warn("ClassFQN is wrong ", info);
    }
  }
}
module.exports = urlParser;

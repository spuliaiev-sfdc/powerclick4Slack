
const urlHelper = {
  generateWorkItemLink(linkData) {
    if (linkData.workitem) {
      return ` *Work* <https://gus.my.salesforce.com/apex/ADM_WorkLocator?bugorworknumber=${linkData.workitem}|${linkData.workitem}>`;
    } else {
      if (linkData.workitemId) {
        const workitemNumber = linkData.workitem ? linkData.workitem : 'WorkItem';
        return ` *Work* <https://gus.lightning.force.com/lightning/r/ADM_Work__c/${linkData.workitemId}/view|${workitemNumber}>\n`;
      }
    }
    return "";
  },

  generateATM(linkData) {
    let urls = "";
    // https://portal.prod.ci.sfdc.net/testhistory?autobuildId=4098&testClass=conversation.calllibrary.SharingRecordCollectionFunctions&testName=saveHook_PostStmtExecuteOnce
    if (linkData.class && linkData.method) {
      let classFQN = linkData.class;

      if (linkData.package) {
        classFQN = linkData.package + "." + linkData.class;
      }
      const testMethod = linkData.testMethod || linkData.method;
      urls += ` <https://portal.prod.ci.sfdc.net/testhistory?autobuildId=4098&testClass=${classFQN}&testName=${linkData.method}|${linkData.class}/${testMethod}>`;
    }
    // https://portal.prod.ci.sfdc.net/testfailures/bughandlerreport?bugNumber=W-8269157
    if (linkData.workitem) {
      urls += ` <https://portal.prod.ci.sfdc.net/testfailures/bughandlerreport?bugNumber=${linkData.workitem}|Bugs>`;
    }
    return urls ? "*ATM* "+urls +"\n": "";
  },

  generateIntelliJ(linkData) {
    let urls = "";
    // IntelliJ http://localhost:63342/api/openFile/ui.sfa.personaccount.PersonAccountRecordServiceFtest/testPersonAccountGetNameFieldValueSalutation:409
    if (linkData.pathInCore) {
      urls = `<http://localhost:63342/api/openFile/${linkData.pathInCore}|${linkData.class}.java>`;
    } else {
      if (linkData.class) {
        let classFQN = linkData.class;

        if (linkData.package) {
          classFQN = linkData.package + "." + linkData.class;
        }
        if (linkData.lineNumber) {
          classFQN = classFQN + ":" + linkData.lineNumber;
        }
        if (linkData.method) {
          classFQN = classFQN + "/" + linkData.method;
        }
        urls = `<http://localhost:63342/api/openFile/${classFQN}|${linkData.class}.java>`;
      }
    }

    return urls ? "*IntelliJ* "+urls +"\n": "";
  },

  generateKodamaUrl(linkData, linkOnly) {
    let urls = "";
    let link = "";
    // https://kodama.eng.sfdc.net/api/v1/file-detail/p4-path/%2F%2Fapp%2Fmain%2Fcore%2Fui-services-private%2Fjava%2Fsrc%2Fui%2Fservices%2Finternal%2Futils%2Fimpl%2FLayoutUtilImpl.java
    if (linkData.fileFull) {
      const encodedPath = encodeURIComponent(linkData.fileFull);
      link = `https://kodama.eng.sfdc.net/api/v1/file-detail/p4-path/${encodedPath}`;
    } else {
      // https://kodama.eng.sfdc.net/api/v1/java-class/Sample
      if (linkData.class) {
        link = `https://kodama.eng.sfdc.net/api/v1/search/java-class/${linkData.class}`;
      }
    }
    if (linkOnly) {
      return link;
    }
    urls = `  <${link}| ${linkData.class}> `;
    return urls ? "*Kodama* "+urls +"\n": "";
  },

  generateSwarm(linkData) {
    let urls = "";
    // https://swarm.soma.salesforce.com/files//app/main/core/conversation-impl/java/src/conversation/calllibrary/SharingRecordCollectionFunctions.java#52
    if (linkData.pathInCore) {
      urls = `<https://swarm.soma.salesforce.com/files${linkData.pathInCore}| ${linkData.class}> `;
    } else {
      // https://swarm.soma.salesforce.com/changes/28248524
      if (linkData.changelist) {
        urls = `  <https://swarm.soma.salesforce.com/changes/${linkData.changelist}| CL ${linkData.changelist}> `;
      }
    }
    return urls ? "*Swarm* "+urls +"\n": "";
  },

  generateCodeSearch(linkData) {
    let urls = "";
    // https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/conversation-impl/java/src/conversation/calllibrary/SharingRecordCollectionFunctions.java#52
    if (linkData.pathInCore) {
      urls = `<https://swarm.soma.salesforce.com/files${linkData.pathInCore}| ${linkData.class}> `;
    } else {
      // https://swarm.soma.salesforce.com/changes/28248524
      if (linkData.changelist) {
        urls = `  <https://swarm.soma.salesforce.com/changes/${linkData.changelist}| CL ${linkData.changelist}> `;
      }
    }
    return urls ? "*Swarm* "+urls +"\n": "";
  },

  generateOwnership(info) {
    if (info.owningTeam) {
      return `*Ownership information:*
*OwningTeam:* <${info.owningTeam.homepageUrl}|${info.owningTeam.name}> from cloud ${info.owningTeam.cloud}
`
    }
    return "";
  }
}

module.exports = urlHelper;


const urlHelper = {
  generateWorkItemLink(linkData) {
    if (linkData.workitem) {
      return ` *Work* <https://gus.my.salesforce.com/apex/ADM_WorkLocator?bugorworknumber=${linkData.workitem}|${linkData.workitem}>\n`;
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
      if (linkData.method.startsWith("test")) {
        let classFQN = linkData.class;

        if (linkData.package) {
          classFQN = linkData.package + "." + linkData.class;
        }
        const testMethod = linkData.testMethod || linkData.method;
        urls += ` <https://portal.prod.ci.sfdc.net/testhistory?autobuildId=4098&testClass=${classFQN}&testName=${linkData.method}|${linkData.class}/${testMethod}>`;
      }
    }
    // https://portal.prod.ci.sfdc.net/testfailures/bughandlerreport?bugNumber=W-8269157
    if (linkData.workitem) {
      urls += ` <https://portal.prod.ci.sfdc.net/testfailures/bughandlerreport?bugNumber=${linkData.workitem}|Bugs>`;
    }
    return urls ? "*AutomationPortal* "+urls +"\n": "";
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

  generateKodamaUrl(info, linkOnly) {
    let urls = "";
    let link = "";
    // https://kodama.eng.sfdc.net/api/v1/file-detail/p4-path/%2F%2Fapp%2Fmain%2Fcore%2Fui-services-private%2Fjava%2Fsrc%2Fui%2Fservices%2Finternal%2Futils%2Fimpl%2FLayoutUtilImpl.java
    if (info.fileFull) {
      const encodedPath = encodeURIComponent(info.fileFull);
      link = `https://kodama.eng.sfdc.net/api/v1/file-detail/p4-path/${encodedPath}`;
    } else {
      // https://kodama.eng.sfdc.net/api/v1/java-class/Sample
      if (info.class) {
        link = `https://kodama.eng.sfdc.net/api/v1/search/java-class/${info.class}`;
      }
    }
    if (linkOnly) {
      return link;
    }
    if (link) {
      urls = `  <${link}| ${info.class}> `;
      return "*Kodama* " + urls + "\n";
    }
    return "";
  },

  generateSwarm(linkData) {
    let urls = "";
    // https://swarm.soma.salesforce.com/files//app/main/core/conversation-impl/java/src/conversation/calllibrary/SharingRecordCollectionFunctions.java#52
    if (linkData.fileFull) {
      urls = `<https://swarm.soma.salesforce.com/files${linkData.fileFull}| ${linkData.class}> `;
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
      let pathInCoreSingleSlash = linkData.fileFull.substr(1);
      let projectPrefix = linkData.project.replace(/\//,"_");
      urls = `<https://codesearch.data.sfdc.net/source/xref/app_${projectPrefix}_core/${pathInCoreSingleSlash}| ${linkData.class}> `;
    } else {
      // https://swarm.soma.salesforce.com/changes/28248524
      if (linkData.changelist) {
        urls = `  <https://swarm.soma.salesforce.com/changes/${linkData.changelist}| CL ${linkData.changelist}> `;
      }
    }
    return urls ? "*CodeSearch* "+urls +"\n": "";
  },

  generateOwnership(info) {
    if (info.owningTeam) {
      let ownedTeamNameEncoded=encodeURIComponent(info.owningTeam.name);
      return `*OwningTeam:* <${info.owningTeam.homepageUrl}|${info.owningTeam.name}> from cloud ${info.owningTeam.cloud}
   Owned files <https://kodama.eng.sfdc.net/static/team.html?teamName=${ownedTeamNameEncoded}|report>
`
    }
    return "";
  }
}

module.exports = urlHelper;

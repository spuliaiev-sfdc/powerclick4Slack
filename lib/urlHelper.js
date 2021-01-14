
const urlHelper = {
  generateWorkItemLink(linkData) {
    if (linkData.workitem) {
      return `<https://gus.my.salesforce.com/apex/ADM_WorkLocator?bugorworknumber=${linkData.workitem}|${linkData.workitem}>`;
    } else {
      if (linkData.workitemId) {
        const workitemNumber = linkData.workitem ? linkData.workitem : 'WorkItem';
        return `<https://gus.lightning.force.com/lightning/r/ADM_Work__c/${linkData.workitemId}/view|${workitemNumber}>`;
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
      urls = `<https://portal.prod.ci.sfdc.net/testhistory?autobuildId=4098&testClass=${classFQN}|${linkData.method}.java>`;
    }
    return urls ? "ATM "+urls : "";
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

    return urls ? "IntelliJ "+urls : "";
  },

  generateKodamaUrl(linkData) {
    let urls = "";
    // https://kodama.eng.sfdc.net/api/v1/file-detail/p4-path/%2F%2Fapp%2Fmain%2Fcore%2Fui-services-private%2Fjava%2Fsrc%2Fui%2Fservices%2Finternal%2Futils%2Fimpl%2FLayoutUtilImpl.java
    if (linkData.pathInCore) {
      const encodedPath = encodeURIComponent(linkData.pathInCore);
      urls = `<https://kodama.eng.sfdc.net/api/v1/file-detail/p4-path/${encodedPath}| ${linkData.class}> `;
    } else {
      // https://kodama.eng.sfdc.net/api/v1/java-class/Sample
      if (linkData.class) {
        urls = `  <https://kodama.eng.sfdc.net/api/v1/java-class/${linkData.class}| ${linkData.class}> `;
      }
    }
    return urls ? "Kodama "+urls : "";
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
    return urls ? "Swarm "+urls : "";
  }
}

module.exports = urlHelper;

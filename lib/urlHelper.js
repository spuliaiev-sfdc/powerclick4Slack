
const urlHelper = {
  generateWorkItemLink(workitem) {
    return `<https://gus.my.salesforce.com/apex/ADM_WorkLocator?bugorworknumber=${workitem}|${workitem}>`;
  }
}

module.exports = urlHelper;

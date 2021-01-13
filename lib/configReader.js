const  fs = require('fs');
const path = require('path');
const PropertiesReader = require('properties-reader');

const configReader = {

  readConfig() {
    const homedir = require('os').homedir();
    const configFile = path.join(homedir, 'blt/config.blt');
    const reader = new PropertiesReader(configFile);
    configReader.userName = reader.get("p4.user");
    configReader.p4UserName = reader.get("p4.user");
    configReader.p4Pass = reader.get("p4.password");
  }

};

module.exports = configReader;

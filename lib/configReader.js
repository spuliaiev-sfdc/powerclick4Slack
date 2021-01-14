const  fs = require('fs');
const path = require('path');
const PropertiesReader = require('properties-reader');

const configReader = {

  readConfig() {
    try {
      const homedir = require('os').homedir();
      const configFile = path.join(homedir, 'blt/config.blt');
      if (fs.existsSync(configFile)) {
        const reader = new PropertiesReader(configFile);
        configReader.userName = reader.get("p4.user");
        configReader.p4UserName = reader.get("p4.user");
        configReader.p4Pass = reader.get("p4.password");
      } else {
        console.log("config file not found");
      }
    } catch (error) {
        console.error(error);
    }
  }

};

module.exports = configReader;

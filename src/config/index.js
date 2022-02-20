const devConfig = require('./devConfig.json');
const prodConfig = require('./prodConfig.json');

const args = process.argv[2];

const config = devConfig;

if(args === "development"){
  config = Object.assign({},devConfig);
} 
if(args === "prod"){
  config = Object.assign({},prodConfig);
} 

module.exports = {
  config,
}
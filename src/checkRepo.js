const updateNotifier = require('update-notifier');
let nodepath = require('path');
// let utils=require('./utils');
let fs = require('fs-extra');
let getInstallRepo = require('./getInstallRepo');

let checkNpmRepo = appOption => {
  let { appName } = appOption;
  return new Promise((resolve, reject) => {
    let rootPath = getInstallRepo(appOption);
    let packagePath = nodepath.join(rootPath, 'package.json');
    let packageObj = fs.readJsonSync(packagePath);
    let version = packageObj.version;
    let no = 0;
    let f = function() {
      let vInfo = updateNotifier({
        pkg: {
          name: appName,
          version
        },
        updateCheckInterval: 1
      }).notify().update;
      no += 1;
      if (!vInfo && no < 3) {
        setTimeout(() => {
          f();
        }, 2000);
      } else {
        if (!vInfo) {
          reject('no update install');
        } else {
          resolve(vInfo);
        }
      }
    };
    f();
  });
};

module.exports = {
  npm: checkNpmRepo
};

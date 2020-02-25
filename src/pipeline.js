let checkRepo = require('./checkRepo');
let getInstallRepo = require('./getInstallRepo');
let nodepath = require('path');
// let chalk = require('chalk');
const spawn = require('cross-spawn');
const fs = require('fs-extra');
let utils = require('./utils');
let cwd = process.cwd();
let mount = require('./mount');

let preHandle = (appOption, last) => {
  let { appName, npm } = appOption;
  return new Promise(resolve => {
    if ([false, 'false'].indexOf(last) !== -1) {
      resolve();
      return;
    }
    //if package is lower version,then install the newest.
    checkRepo
      .npm(appOption)
      .then(info => {
        let latest = info.latest;
        try {
          spawn.sync(npm, ['i', `${appName}@${latest}`, '-S'], {
            stdio: 'inherit',
            cwd: nodepath.join(__dirname, '../')
          });
          resolve();
        } catch (e) {
          console.log(e);
          resolve();
        }
      })
      .catch(e => {
        console.log(e);
        resolve();
      });
  });
};

let copyFunc = async (copyResource, appOption, projectName) => {
  copyResource.forEach(async info => {
    let { src, dist, type } = info;
    fs.copySync(src, dist);
    try {
      await mount.copy(dist, projectName, appOption, type);
      if(type!=='copy'){
        utils.print(`create ${projectName} ${dist} success`);
      }
    } catch (e) {
      throw new Error(e);
    }
  });
};

//copy codes from origin to aim
let copy = async (appOption, mode, projectName, option, ifCheck = true) => {
  let { nowrap = false, dist = '', last } = option;
  if (!projectName && !nowrap) {
    utils.print(
      `appName is not point,you need point just like 'zoom-create-bot create lti'`
    );
    process.exit(1);
  }
  projectName = projectName || 'app';
  console.log('waiting...');
  //from npm name to src position
  let originSrc = getInstallRepo(appOption);
  let resource = appOption.resourceMap[mode];

  if (!resource || resource.length === 0) {
    return {status:false,result:'empty'};
  }
  try {
    fs.statSync(originSrc);
  } catch (e) {
    console.log(e);
    return {status:false,result:'file error'};
  }
  let originDist = nowrap
    ? nodepath.join(cwd, dist)
    : nodepath.join(cwd, dist, projectName);
  let copyResource = resource.map(info => {
    let { src, dist, type } = info;
    return {
      src: nodepath.join(originSrc, ...src),
      dist: nodepath.join(originDist, dist),
      type
    };
  });
  let error=null;
  if (ifCheck === false) {
    [error] = await utils.to(copyFunc(copyResource, appOption, projectName));
  } else {
    await utils.to(preHandle(appOption, last));
    [error] = await utils.to(copyFunc(copyResource, appOption, projectName));
  }
  if(error){
    throw new Error(error);
  }
  return {status:true}
};


module.exports = {
  copy
};

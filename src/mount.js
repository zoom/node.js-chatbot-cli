const spawn = require('cross-spawn');
const jsonFormat = require('json-format');
let nodepath = require('path');
const fs = require('fs-extra');
let utils = require('./utils');

let copy = (dist, projectName, appOption,type) => {
  let { npm } = appOption;
  return new Promise((resolve, reject) => {
    try {
      let packagePath = nodepath.join(dist, 'package.json');
      let packageObject = fs.readJsonSync(packagePath);
      packageObject.name = projectName;
      fs.writeFileSync(packagePath, jsonFormat(packageObject), 'utf8');
      
      if(type==='serverless'){
        ['serverless.development.json','serverless.production.json'].forEach((file)=>{
          let dpath=nodepath.join(dist,file);
          let djson=fs.readJsonSync(dpath);
          if(typeof djson.environment!=='object'){
            djson.environment={};
          }
          djson.environment.app=projectName;
          // djson.app=projectName;
          fs.writeFileSync(dpath, jsonFormat(djson), 'utf8');
        });
      }
      
      if(type!=='copy'){
      utils.print(`begin to install deps to ${dist}`, 'green');
      
        spawn.sync(npm, ['i'], {
          stdio: 'inherit',
          cwd: dist
        });
      }
      
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  copy
};

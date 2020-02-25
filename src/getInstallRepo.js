let nodepath=require('path');
let utils=require('./utils');
let fs=require('fs-extra');
const spawn = require('cross-spawn');


let getInstallRepo=(appOption)=>{
    let {npm,appName}=appOption;
    // let ph=nodepath.join(__dirname,`../node_modules/${appName}`);
    let ph=utils.getRepoPath(appName);
    try{
        fs.statSync(ph);
    }
    catch(e){
       spawn.sync(npm, ['i', `${appName}`, '-S'], { stdio: 'inherit' ,cwd:nodepath.join(__dirname,'..')});
    }
    return ph;
};


module.exports=getInstallRepo;


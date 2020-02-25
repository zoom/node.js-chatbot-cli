
let chalk = require('chalk');
let nodepath=require('path');

let getRepoPath=(appName)=>{
  return nodepath.join(__dirname,`../node_modules/${appName}`);
};



let getRootDir=(path)=>{
  let arr=path.split('/');
  let lg=arr.length;
  let i=lg-1;
  let pos=0;
  for(;i>=0;i-=1){
    let name=arr[i];
    if(name=='node_modules'){
      pos=i+1;
      break;
    }
  }
  return arr.slice(0,pos+1).join('/');
  };

let to=function(promise){
  return promise.then(data => {
    return [null, data];
 })
 .catch(err => [err]);
};


module.exports = {
    to,
    getRootDir,
    getRepoPath,
    print(text,color){
        if(!color){
            console.log(text);
        }
        else{
            console.log(chalk[color](text));
        }
    }
};
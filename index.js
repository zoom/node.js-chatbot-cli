#!/usr/bin/env node

const nodepath = require('path');
// const chalk = require('chalk');
// const compareV = require('compare-versions');
const program = require('commander');
let chalk=require('chalk');
// const main = require("./index.js");
// const spawn=require('cross-spawn');
const fs = require('fs-extra');
let pipeline = require('./src/pipeline');
var inquirer = require('inquirer');

// let cwd = process.cwd();
let packageInfo = fs.readJsonSync(nodepath.join(__dirname, './package.json'));

let appOption = {
  appName: '@zoomus/zoombottemplates',
  npm: 'npm',
  resourceMap: {
    general: [
      { src: ['resource', 'testjest', 'package'], dist: '/',type:'copy' },
      { src: ['resource', 'general', 'package'], dist: '/' }
    ],
    serverless: [
      { src: ['resource', 'testjest', 'package'], dist: '/',type:'copy' },
      {
        src: ['resource', 'serverless', 'package'],
        dist: '/',
        type: 'serverless'
      } //type use for mode to handle special logic
    ],
    'general-demo-withdynamodb': [
      { src: ['resource', 'testjest', 'package'], dist: '/',type:'copy' },
      { src: ['resource', 'general', 'package'], dist: '/', type: 'copy' },
      { src: ['resource', 'general-db-files', 'package'], dist: '/' }
    ],
    'serverless-demo-withdynamodb': [
      { src: ['resource', 'testjest', 'package'], dist: '/',type:'copy' },
      {
        src: ['resource', 'serverless', 'package'],
        dist: '/',
        type: 'copy'
      },
      { src: ['resource', 'serverless-db-files', 'package'], dist: '/' ,type:'serverless'}
    ]
  }
};



let nameInfo={
  // 'nopage':{
  //   value:'nopage',
  //   name:'not use static page',
  //   short:'done selected'
  // },
  // 'react-page':{
  //   value:'react-page',
  //   name:'create static page for you',
  //   short:'static page selected'
  // },
  general:{
    value:'general',
    name:'general - skeleton code config to run on servers',
    short:'general selected'
  },
  serverless:{
    value:'serverless',
    name:'serverless - skeleton code config to run on serverless',
    short:'serverless selected'
  },
  'general-demo-withdynamodb':{
    value:'general-demo-withdynamodb',
    name:'general-demo-withdynamodb - See a quick demo of server mode usage using DynamoDB',
    short:'general-demo-withdynamodb selected'
  },
  'serverless-demo-withdynamodb':{
    value:'serverless-demo-withdynamodb',
    name:'serverless-demo-withdynamodb - See a quick demo of serverless mode usage using DynamoDB',
    short:'serverless-demo-withdynamodb selected'
  }
};


program
  .version(packageInfo.version)
  .command('create [projectName]')
  .option('-d,--dist <dist>', 'aim directory which you want to create in')
  .option('-l,--last <tf>', 'whether use newest or not')
  .option(
    '-n,--nowrap',
    'not create a parent directory,insert files&&dirs to current dir'
  )
  .action(async function(projectName, options) {
    let keys = Object.keys(appOption.resourceMap);
    let mapKeys=keys.map((k)=>{
      return nameInfo[k];
    });
    try{
      let notices=[];
      let answers=await inquirer.prompt([ { type: 'list', message: 'Select a mode', name: 'line', choices: mapKeys } ]);
      let line = answers.line;
      if(line.indexOf('demo')!==-1){
        notices.push('you can run "npm run dynamodb" to install dynamodb local');
      }
      await pipeline.copy(appOption, line, projectName, options);
      // let staticKeys = Object.keys(staticOption.resourceMap);
      // let staticMapKeys=staticKeys.map((k)=>{
      //   return nameInfo[k];
      // });
      notices.push('you can use "npm run start" to start backend');
      // let staticAnswers=await inquirer.prompt([ { type: 'list', message: 'Select a mode', name: 'line', choices: staticMapKeys } ]);
      // let staticLine = staticAnswers.line;
      // if(staticLine!=='nopage'){
      //   notices.push('you can use "npm run start:frontend" to start frontend page');
      //   notices.push('you can use "npm run start-all" to start backend and frontend together');
      //   await pipeline.copy(staticOption, staticLine, projectName, options,false);
      // }
      notices.forEach((notice,ind)=>{
        console.log((ind+1)+': '+chalk.green(notice));
      });
    }
    catch(e){
      console.log(e);
    }
  });

program.parse(process.argv);

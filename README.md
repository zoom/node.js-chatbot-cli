# Zoom Node.js Chatbot Command Line Interface
This is a cli package that automatically sets up a Node.js Zoom chatbot project for you. This allows you to quickly start developing chatbots without having to worry about setting up a project, doing Zoom OAuth, and other boilerplate logic and allows you to immediately concentrate on developing your business logic.

## Installation

`$ npm i @zoomus/chatbot-cli -g`

## Usage

1. `zoomchatbot create examplebot` //Choose one development deployment method in terminal

1. `cd examplebot` `npm run start` // start your app demo.If you select demo type in terminal, use `npm run dynamodb` to create local dynamodb tables first(before install dynamodb local,need to ensure have java env && bind aws key secret first,you can use fake aws key&secret for test)

1. Visit https://marketplace.zoom.us/, create a new bot and copy credentials to your environment file

1. In your Zoom Chat, you can enter commands to your bot, our skeleton code has "help" and "vote"(use [create-zoom-message-tool](https://nodebots.zoom.us/botbuilderkit/page/createMessage) to get sendmessage json by visual drag)

1. `npm run test` //use jest to test app

## Setup & Features

This app is base on node [express](https://expressjs.com/),and [nodejs](https://nodejs.org/en/) version >= 8.*

See [marketplace docs](https://marketplace.zoom.us/docs/guides/chatbots/build-a-chatbot) to learn how to create bot and get information you need to paste into your code's environment variables file: `.development.env` for general mode, `serverless.development.json` for serverless mode.

Here you will see either `.development.env` for general mode or `serverless.development.json` for serverless mode. You will need to fill this out with your bot's information. Below is an example screenshot:

![general](https://s3.amazonaws.com/user-content.stoplight.io/10128/1582241210819)

You will also see a file called `botConfig.js`. In this file, we can add features to our bot. Let's go over the sections of `botConfig.js`:


### 1. **`apis`,configure api endpoints for your bot**
Basically, when your bot receives a request, we will call the function specified in `callback` and auto inject useful objects into res.locals for you to use.

There are two special api type,one is **Redirect URL for OAuth**(zoomType:'auth'),another is **Bot endpoint URL**(zoomType:'command').

zoomType:'command' is the webhook url(https://your url/command) to bind in zoom [marketplace](https://marketplace.zoom.us).This type api not need bind callback,app will help to transfer the webhook informations to botCommands&&botActions.

In zoomType='auth',let {zoomApp,botLog,databaseModels?,request}=res.locals can be used. In zoomApp you can auto get zoom access_token information.

In zoomType='command',let {zoomApp,zoomWebhook,botLog,databaseModels?,request}=res.locals can be used in botActions&&botCommands config.

In other general apis, let {zoomApp,botLog,databaseModels?,request}=req.locals can be used.

in the docs bottom ,you can see the api section of **zoomApp,zoomWebhook,zoomError,botLog,databaseModels,request**.And in your **./src directory**,you can see the example code of these injected instances.

```js
   apis: [{
       url: '/command',
       method: 'post',
       zoomType: 'command'
     }, //callbacks see botCommands&botActions
     {
       url: '/auth',
       method: 'get',
       callback: require('./src/auth'),
       zoomType: 'auth'
     },
     {
       url: '/test',
       method: 'get',
       callback: function(req, res, next) {}
     } //it is a general api
   ]
```

### 2. **`botCommands`: Configure your bot’s slash.**
When your bot's user's enter commands, it will call the function specified in the `callback` for that command. *let {zoomApp,zoomWebhook,botLog,databaseModels?,request}=res.locals* will be injeced in callback

```js
   botCommands: [{
       command: 'help',
       callback: require('./src/help.js')
     },
     {
       callback: require('./src/noCommand.js') // no matched command,will call this function
     }
   ]
```

### 3.  **`botActions`: Configure your bot’s UI actions**
Triggers callback whenever a user presses a button, clicks a dropdown, edits a textbox, etc on your bot’s messages. For more command types, please see [zoom-message-with-buttons](https://marketplace.zoom.us/docs/guides/chatbots/customizing-messages/message-with-buttons).

Zoom supports `interactive_message_select`, `interactive_message_actions`, `interactive_message_editable`, and `interactive_message_fields_editable` types. You can see [zoom-message-with-dropdown](https://marketplace.zoom.us/docs/guides/chatbots/customizing-messages/message-with-dropdown) for more details.

*let {zoomApp,zoomWebhook,botLog,databaseModels?,request}=res.locals* will be injeced in callback

   ```js
   botActions: [{
     command: 'interactive_message_actions',
     callback: require('./src/interactive_message_actions.js')
   }]
   ```


### 4. **`log`: Raw http request information which you can use to perform logging.**

The default supports three log types, the first are requests that calls a Zoom API or sends a Zoom message. The second one are commands that users type into the Zoom Chat. The last one is error_notice type, and it is triggered by request errors on both sides.

If you use *let {request}=res.locals* to request other platform's api, you can also log the http information in the callback. (Request is the method which wrap [node-fetch](https://www.npmjs.com/package/node-fetch) and put form-data and form-parameters in simple object)

```js
   //auto support three types log which you can see in this function
   info: {
     type: 'http',
     message: {
       request: {
         url,
         body,
         headers
       },
       response: {
         status,
         body
       },
       error //also trigger in error_notice when it not be falsely
     }
   }
   info: {
     type: 'webhook',
     message: {
       request: {
         url
       },
       error
     }
   }
   info: {
     type: 'error_notice',
     message: {
       error
     } //only happen when we have http error and webhook verify fail
   }

   log: function(info) {
     console.log(info.type, info.message.request.url);
   }
  ```

   You can also log information in callback function, we will inject botLog instance after you bind log in botConfig.

   ```js
   module.exports = function(req, res) {
     let {
       botLog
     } = res.locals;

     botLog({ //will call result in log function of botConfig.js
       type: 'your log type',
       message: {
         error,
         ...
       }
     });
   }
   ```


### 5. **res.locals in callback**

* in zoomType='auth',let {zoomApp,botLog,databaseModels,request}=res.locals can be used
* in zoomType='command' which used botCommands&&botActions,let {zoomApp,zoomWebhook,botLog,databaseModels,request}=res.locals can be used.
* in general apis,let {zoomApp,botLog,databaseModels,request}=req.locals can be used.


you can see [zoom chatbot libaray](https://www.npmjs.com/package/@zoomus/chatbot) to see more details of these instance, and in your **./src** directory you can see the template code.


**zoomError**
when some error happen in internal middleware,will have zoomError in locals

```js
let { zoomError } = res.locals;
if(!zoomError){
  //do sendmessage and other logic
}
catch(e){
  console.log(e);
}

```

**zoomApp**
you can use zoomApp to sendMessage,request openapi

sendMessage example code,feedback the message from webhook channel.

```js
let { zoomApp, zoomWebhook } = res.locals;
let { type, payload } = zoomWebhook;
let { toJid, userJid, accountId } = payload;
await zoomApp.sendMessage({ to_jid: toJid, account_id: accountId, user_jid: userJid, is_visible_you: true, content: { head: { type: 'message', text: `Hi there - I'm ${process.env.NAME} bot`, style: { bold: true } }, body: [ { type: 'message', text: 'Here are some quick tips to get started!' }, { type: 'message', text: 'vote', style: { bold: true } }, { type:'message', text:'Click a button to vote your Favorite food' }, { type: 'message', text: 'meet', style: { bold: true } }, { type:'message', text:'get your meet url' } ] } });
```

request Zoom api(see [zoom chatbot libaray](https://www.npmjs.com/package/@zoomus/chatbot) to see more details of zoomApp request openapi)

```js
let { zoomApp, zoomWebhook } = res.locals;
let { type, payload } = zoomWebhook;
let { toJid, userJid, userId, accountId } = payload;
zoomApp.auth.setTokens({
  access_token: database.get('access_token'),
  refresh_token: database.get('refresh_token'),
  expires_date: database.get('expires_date')
});
zoomApp.auth.callbackRefreshTokens(async function(tokens,error) {
  if(error){
    //try use refresh token to get access_token,but also fail,refresh token is invalid
  }
  else{
    try {
      await database.update(...);//update tokens in database 
    } catch (e) {
      console.log(e);
    }
  }
});

let meetingInfo = await zoomApp.request({
  url: `/v2/users/${userId}/meetings`,
  method: 'post',
  headers: { 'content-type': 'application/json' },
  body: {
    topic: `New ${process.env.app} Meeting`,
    type: 2,
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: true,
      enforce_login: true,
      mute_upon_entry: true
    }
  }
});

```


**zoomWebhook**

Get Zoom Chat channel/bot information from the commands that users type(see [zoom chatbot libaray](https://www.npmjs.com/package/@zoomus/chatbot) to see more details of zoomWebhook)

```js
let { zoomWebhook } = res.locals;
let { type, payload } = zoomWebhook;// type = 'channel'|'bot'
let { toJid, userJid, userId, accountId } = payload;
// do the logic
```

**botLog**

```js
let {botLog}=res.locals;
//this message will run log(function(info){..}) in your botConfig.js
botLog({
  type:'',
  message:{error:..}
});

```

**databaseModels**
You can use this after binding useDatabase models in botConfig.js, please see the "Database" section at the bottom of this document


**request**

Request is the method which wrap [node-fetch](https://www.npmjs.com/package/node-fetch) and puts form-data and form-parameters in simple object

Request will auto call the logging function bot(function(info){}) in your botConfig.js,you can then implement that function to log whatever you wish to log.

see [zoom chatbot libaray](https://www.npmjs.com/package/@zoomus/chatbot) to see more details of request

```js
//request other platform openapi,just like slack openapi.

let {request}=res.locals;
request({
  url:string,
  method:'post',
  headers:{},
  body:{a:1,b:2}
});

```


## Included Demos

If you wish to quickly see a demo of how to use this package.

### Prerequisites:

The demo runs DynamoDB, so you must have Java installed on your computer, as well as AWS CLI set up. To Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
After installing, run `aws configure`, then configure your access key Id, and secret access key, (These two values don’t have to be real, can just be made up for local testing). You should be admin privileges on your computer and you should have a chatbot app set up on marketplace with the following scopes:

![scopes](https://s3.amazonaws.com/user-content.stoplight.io/10128/1586393123802)

To run demo:

1. `zoomchatbot create app`

1. select general-demo-withdynamodb or serverless-demo-withdynamodb in terminal.

1. Set up your bot’s environment variables: .development.env for general mode, serverless.development.json for serverless mode, described in Setup & Features.

1. Set up your bot on marketplace.

1. Use `npm run dynamodb` to start dynamoDB.

1. Use `npm run start` to start your app

1. (Optional) If you wish to use the demo's "meet" command, you must go to your bot's marketplace page and under "Scopes", add the scope "meeting:write:admin".

1. Go to your bot's marketplace page and under "Local Test", click "Install".

## Database

`useDatabase`: This section is totally optional. You can connect to your database anyway you see fit, however, we also support database config in `botConfig.js`. Once you construct your database object in `useDatabase`, we will auto inject an object called `databaseModels` into res.locals of each callback. `databaseModels` will be constructed using "lib" and "option" you defined in `useDatabase`. Below is an example code using DynamoDB as an example:(see [botdynamodb](https://www.npmjs.com/package/botdynamodb) for how to write a custom database package, see [botdblocal](https://www.npmjs.com/package/botdblocal) for how to create local dynamodb tables).

```js
useDatabase: {
  lib: require('some database library for zoom bot'),
  option: {
    tables: {
      zoom: {
        tableName: 'zoomtable',
        hashKey: 'zoom_account_id',
        schema: {
          zoom_account_id: joi.string(),
          zoom_access_token: joi.string()
        }
      }
    },
    port: 8089,
    region: 'us-east-1'
  }
}
```

And will auto inject `databaseModels` into res.locals of each callback:

```js
let {
  zoomApp,
  zoomError,
  databaseModels
} = res.locals;

await databaseModels.zoom.save({
  zoom_account_id: accountId
});
```

## Additional Info

* We have already installed [node-fetch](https://www.npmjs.com/package/node-fetch), you can use it for your http requests.

* Feel free to modify `app.js`, as it is general express code.

* In `app.js` we use [botservice])(https://www.npmjs.com/package/@zoomus/botservice) as the core lib to consume `botConfig.js`.

* In the `views` directory we used [hbs](https://www.npmjs.com/package/hbs) for the html template.

* To run tests, run `$ npm run test`. Feel free to modify/add to the `tests` directory.

## Need Support?
The first place to look for help is on our [Developer Forum](https://devforum.zoom.us/), where Zoom Marketplace Developers can ask questions for public answers.

If you can’t find the answer in the Developer Forum or your request requires sensitive information to be relayed, please email us at developersupport@zoom.us.

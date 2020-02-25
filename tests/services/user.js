let user={
appName:'bottest',
npm:'npm',
mode:'general',
option:{
  dist:'/tests'
},
appOption:{
  appName: '@zoomus/zoombottemplates',
  npm: 'npm',
  resourceMap: {
    general: [
      { src: ['resource', 'general', 'package'], dist: '/' }
    ],
    serverless: [
      {
        src: ['resource', 'serverless', 'package'],
        dist: '/',
        type: 'serverless'
      } //type use for mode to handle special logic
    ],
    'general-demo-withdynamodb': [
      { src: ['resource', 'general', 'package'], dist: '/', type: 'copy' },
      { src: ['resource', 'general-db-files', 'package'], dist: '/' }
    ],
    'serverless-demo-withdynamodb': [
      {
        src: ['resource', 'serverless', 'package'],
        dist: '/',
        type: 'copy'
      },
      { src: ['resource', 'serverless-db-files', 'package'], dist: '/' ,type:'serverless'}
    ]
  }
}
};


module.exports=user;
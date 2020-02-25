require('../services/mockDep');
const pipeline = require('../../src/pipeline');
let userData = require('../services/user');
let preHandle = pipeline.__get__('preHandle');
let copyFunc = pipeline.__get__('copyFunc');

jest.mock('../../src/checkRepo.js', function() {
  return {
    npm: jest.fn().mockImplementation(() => Promise.resolve({ latest: '' }))
  };
});

jest.mock('../../src/mount', function() {
  return {
    copy() {
      return jest.fn(() => {
        console.log('mount copy run');
      });
    }
  };
});

describe('test private function', () => {
  let { appName, npm, appOption,mode } = userData;
  let {resourceMap}=appOption;
  let copyResource=resourceMap[mode];
  test('preHandle:check repo and update to new repo version', () => {
    expect.assertions(1);
    return expect(preHandle({ appName, npm }, true)).resolves.toBeFalsy();
  });

  test('copyFunc:copy repo to current directory', () => {
    expect.assertions(1);
    return expect(
      copyFunc(copyResource, { npm, appName }, appName)
    ).resolves.toBeFalsy();
  });
});


describe('test public function',()=>{
  let { appName, npm, appOption,mode ,option} = userData;
  test('copy function',()=>{
    expect.assertions(1);
    return expect(pipeline.copy(appOption,mode,appName,option)).resolves.toEqual({status:true});
  });
});
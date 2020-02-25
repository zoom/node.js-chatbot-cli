require('../services/mockDep');
const nodepath=require('path');
let getInstallRepo=require('../../src/getInstallRepo');
let utils =require('../../src/utils');
let userData=require('../services/user');

let repoSpy=jest.spyOn(utils,'getRepoPath');

describe('test repo install', () => {
  let {appName,npm}=userData;
  let out=nodepath.resolve(`node_modules/${appName}`);
  test('check path', () => {
    expect(utils.getRepoPath(appName)).toBe(out);
    expect(getInstallRepo({appName,npm})).toBe(out);
    expect(repoSpy).toHaveBeenCalledTimes(2);
    expect(repoSpy.mock.calls[1][0]).toBe(appName);
  });

});


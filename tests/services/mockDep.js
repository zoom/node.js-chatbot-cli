jest.spyOn(process, 'exit').mockImplementation(number => {
  console.log(number);
});

jest.mock('cross-spawn', function() {
  return {
    sync() {
      console.log('mock cross-spawn');
    }
  };
});

jest.mock('fs-extra', function() {
  return {
    copySync() {
      console.log('mock copySync run');
    },
    statSync() {
      console.log('mock statSync run');
    }
  };
});

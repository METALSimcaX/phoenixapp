var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './release/package/MacropayPackage-win32-x64',
    outputDirectory: './release/installer',
    authors: 'Macropay',
    exe: 'MacropayPackage.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`Error task: ${e.message}`));
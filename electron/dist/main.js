"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win;
// Listener sobre la ventana lista de windows y ver el estado de esta
electron_1.app.on('ready', createWindow);
// Evento para crear la ventana de windows
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('app_version', function (event) {
    event.sender.send('app_version', { version: electron_1.app.getVersion() });
});
// Funcion para crear la ventana con su configuración
function createWindow() {
    var log = require("electron-log");
    log.transports.file.level = "debug";
    console.log("Begin application..");
    //win = new BrowserWindow({ width: 800, height: 600 });
    win = new electron_1.BrowserWindow({
        fullscreen: true,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
            webSecurity: false
        }
    });
    electron_1.app.commandLine.appendSwitch('ignore-certificate-errors');
    //win.loadURL(url.format({ pathname: path.join(__dirname, `/../../dist/macroLoginFront/index.html`), protocol: 'file:', slashes: true })); //DEV QA
    //win.loadURL(url.format({ pathname: path.join(__dirname, `/../../macro-login-front-win32-x64/resources/app/dist/macroLoginFront/index.html`), protocol: 'file:', slashes: true })); // Empaquetado PROD
    win.loadURL(url.format({ pathname: path.join(__dirname, "/../../macropay-win32-x64/resources/app/dist/macroLoginFront/index.html"), protocol: 'file:', slashes: true })); // Empaquetado PROD
    win.setMenu(null);
    win.removeMenu();
    electron_1.Menu.setApplicationMenu(null);
    console.log('Ver. ', electron_1.autoUpdater.getFeedURL());
    // Evento solo importante en casos de MacOS
    win.on('closed', function () {
        win = null;
    });
    console.log('Check version: ' + electron_1.app.getVersion(), '-', process.env.NODE_ENV);
    win.webContents.openDevTools();
    if (true) {
        console.log("Begin config squirrel..");
        if (require('electron-squirrel-startup')) {
            return;
        }
        if (process.platform !== 'win32') {
            return false;
        }
        var squirrelCommand = process.argv[1];
        switch (squirrelCommand) {
            case '--squirrel-install':
            case '--squirrel-updated':
                install();
                return true;
            case '--squirrel-uninstall':
                uninstall();
                electron_1.app.quit();
                return true;
            case '--squirrel-obsolete':
                electron_1.app.quit();
                return true;
        }
        autoUpdaterInstance();
    }
    else {
        // Permite abrir el inspector del navegador para modo Dev
        win.webContents.openDevTools();
    }
    console.log("End application..");
}
function autoUpdaterInstance() {
    /*autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        }

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })*/
    electron_1.autoUpdater.on('error', function (err) { return console.error("Update error: " + err.message); });
    electron_1.autoUpdater.on('update-available', function () {
        console.log('ua');
        win.webContents.send('update_available');
    });
    electron_1.autoUpdater.on('update-downloaded', function () {
        win.webContents.send('update_downloaded');
        console.log('ud');
        var dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: "new realease",
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        };
        electron_1.dialog.showMessageBox(dialogOpts).then(function (returnValue) {
            if (returnValue.response === 0)
                electron_1.autoUpdater.quitAndInstall();
        });
        win.webContents.send('update_downloaded');
    });
    electron_1.ipcMain.on('restart_app', function () {
        electron_1.autoUpdater.quitAndInstall();
    });
    electron_1.autoUpdater.setFeedURL({ url: 'http://localhost:8050/releases/' });
    console.log("Begin autoupdate check", electron_1.autoUpdater.getFeedURL());
    electron_1.autoUpdater.checkForUpdates();
}
//Installation
function install() {
    var cp = require('child_process');
    var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
    var target = path.basename(process.execPath);
    var child = cp.spawn(updateDotExe, ['--createShortcut', target], {
        detached: true,
    });
    child.on('close', function (code) {
        electron_1.app.quit();
    });
}
//Uninstall
function uninstall() {
    var cp = require('child_process');
    var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
    var target = path.basename(process.execPath);
    var child = cp.spawn(updateDotExe, ['--removeShortcut', target], {
        detached: true,
    });
    child.on('close', function (code) {
        electron_1.app.quit();
    });
}
/*
function startupEventHandle()
{
    if (require('electron-squirrel-startup')) return;

    var handleStartupEvent = function()
    {
        if (process.platform !== 'win32')
        {
            return false;
        }

        var squirrelCommand = process.argv[1];

        switch (squirrelCommand)
        {
            case '--squirrel-install':
            case '--squirrel-updated':
                install();
                return true;
            case '--squirrel-uninstall':
                uninstall();
                app.quit();
                return true;
            case '--squirrel-obsolete':
                app.quit();
                return true;
        }

        //Installation
        function install()
        {
            var cp = require('child_process');
            var updateDotExe = path.resolve(path.dirname(process.execPath),'..','update.exe');
            var target = path.basename(process.execPath);
            var child = cp.spawn(updateDotExe, ['--createShortcut', target], {
                detached: true,
            });
            child.on('close', function (code) {
                app.quit();
            });
        }

        //Uninstall
        function uninstall()
        {
            var cp = require('child_process');
            var updateDotExe = path.resolve(
                path.dirname(process.execPath),'..','update.exe'
            );
            var target = path.basename(process.execPath);
            var child = cp.spawn(updateDotExe, ['--removeShortcut', target], {
                detached: true,
            });
            child.on('close', function (code) {
                app.quit();
            });
        }
    };

    if (handleStartupEvent())
    {
        return;
    }
}*/ 
//# sourceMappingURL=main.js.map
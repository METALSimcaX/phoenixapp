import { app, BrowserWindow, Menu, ipcMain, dialog, autoUpdater } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow;

// Listener sobre la ventana lista de windows y ver el estado de esta
app.on('ready', createWindow);

// Evento para crear la ventana de windows
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

// Funcion para crear la ventana con su configuración
function createWindow()
{
    const log = require("electron-log");
    log.transports.file.level = "debug";

    console.log("Begin application..");

    //win = new BrowserWindow({ width: 800, height: 600 });
    win = new BrowserWindow({
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

    app.commandLine.appendSwitch('ignore-certificate-errors');
    
    //win.loadURL(url.format({ pathname: path.join(__dirname, `/../../dist/macroLoginFront/index.html`), protocol: 'file:', slashes: true })); //DEV QA
    //win.loadURL(url.format({ pathname: path.join(__dirname, `/../../macro-login-front-win32-x64/resources/app/dist/macroLoginFront/index.html`), protocol: 'file:', slashes: true })); // Empaquetado PROD
    win.loadURL(url.format({ pathname: path.join(__dirname, `/../../macropay-win32-x64/resources/app/dist/macroLoginFront/index.html`), protocol: 'file:', slashes: true })); // Empaquetado PROD

    win.setMenu(null);
    win.removeMenu();
    Menu.setApplicationMenu(null);

    console.log('Ver. ', autoUpdater.getFeedURL());

    // Evento solo importante en casos de MacOS
    win.on('closed', () => {
        win = null;
    });

    console.log('Check version: '+app.getVersion(), '-', process.env.NODE_ENV);

    win.webContents.openDevTools();
    
    if(true)
    {
        console.log("Begin config squirrel..");

        if(require('electron-squirrel-startup')){ return; }

        if(process.platform !== 'win32')
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

        autoUpdaterInstance();
    }
    else
    {
        // Permite abrir el inspector del navegador para modo Dev
        win.webContents.openDevTools();
    }

    console.log("End application..");
}

function autoUpdaterInstance()
{
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

    autoUpdater.on('error', (err) => console.error(`Update error: ${err.message}`));

    autoUpdater.on('update-available', () => {
        console.log('ua');
        win.webContents.send('update_available');
    });

    autoUpdater.on('update-downloaded', () => {
        win.webContents.send('update_downloaded');

        console.log('ud');
        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: "new realease",
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        }

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })

        win.webContents.send('update_downloaded');
    });

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });

    autoUpdater.setFeedURL({ url: 'http://localhost:8050/releases/' });

    console.log("Begin autoupdate check", autoUpdater.getFeedURL());
    autoUpdater.checkForUpdates();
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
        path.dirname(process.execPath),
        '..',
        'update.exe'
    );
    var target = path.basename(process.execPath);
    var child = cp.spawn(updateDotExe, ['--removeShortcut', target], {
        detached: true,
    });
    child.on('close', function (code) {
        app.quit();
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
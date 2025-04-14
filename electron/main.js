const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const { spawn } = require('child_process');
const { powerMonitor } = require('electron');
const path = require('path');

let mainWindow;
let jsonServerProcess;
let tray;
let tracks = [];

app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-features', 'AutofillServerCommunication');

app.whenReady().then(() => {
    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, 'assets', 'icon.png'));
    }

    startJsonServer().then(() => {
        createMainWindow();
        createTray();
        setupIpcListeners();
    }).catch(err => {
        console.error('Erreur lors du démarrage de json-server :', err);
    });

    setupIdleMonitor();
});

function startJsonServer() {
    return new Promise((resolve, reject) => {
        jsonServerProcess = spawn('node', [
            path.join(__dirname, '../node_modules/.bin/json-server'),
            '--watch',
            path.join(__dirname, '../src/app/common/mock/database.json'),
            '--port',
            '25564'
        ]);

        jsonServerProcess.stdout.on('data', (data) => {
            const message = data.toString();
            console.log(`json-server: ${message}`);

            if (message.includes('Watching')) {
                resolve();
            }
        });

        jsonServerProcess.stderr.on('data', (data) => {
            console.error(`json-server erreur: ${data}`);
        });

        jsonServerProcess.on('error', (err) => {
            reject(err);
        });
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/daytracker/browser/index.html'));
    // mainWindow.webContents.openDevTools();

    mainWindow.on('close', (event) => {
        const response = require('electron').dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Annuler', 'Quitter'],
            defaultId: 1,
            cancelId: 0,
            title: 'Confirmer',
            message: 'Es-tu sûr de vouloir quitter DayTracker ?'
        });

        if (response === 0) {
            event.preventDefault();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'assets', 'chronometer.png'));
    tray.setToolTip('DayTracker');
    tray.setTitle(`Task name`);
    updateContextMenu();
    updateTrayText('');
}

function setupIpcListeners() {
    ipcMain.on('update-timer', (_, timerValue) => updateTrayText(timerValue));
    ipcMain.on('start-timer', () => mainWindow.webContents.send('start-timer'));
    ipcMain.on('pause-timer', () => mainWindow.webContents.send('pause-timer'));
    ipcMain.on('update-menu', () => mainWindow.webContents.send('update-timer'));
    ipcMain.on('save-menu', () => mainWindow.webContents.send('save-timer'));
    ipcMain.on('update-tracks', (event, newTracks) => {
        tracks = newTracks;
        console.log(tracks);
        updateContextMenu();
    });
}

function updateContextMenu() {
    const trackItems = tracks.map(track => ({
        label: track.name,
        click: () => mainWindow.webContents.send('select-track', track)
    }));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Démarrer', click: () => mainWindow.webContents.send('start-timer') },
        { label: 'Pause', click: () => mainWindow.webContents.send('pause-timer') },
        { label: 'Sauvegarder', click: () => mainWindow.webContents.send('save-timer') },
        { type: 'separator' },
        ...trackItems,
        { type: 'separator' },
        { label: 'Quitter', click: () => app.quit() }
    ]);

    tray.setContextMenu(contextMenu);
}

function updateTrayText(timerValue) {
    tray.setTitle(`${timerValue}`);
}

function setupIdleMonitor() {
    const INACTIVITY_LIMIT = 15 * 60;

    setInterval(() => {
        const idleTime = powerMonitor.getSystemIdleTime();
        if (idleTime >= INACTIVITY_LIMIT) {
            console.log(`[Inactivité] ${idleTime}s — pause automatique`);
            mainWindow.webContents.send('pause-timer');
        }
    }, 30 * 1000);

    powerMonitor.on('user-did-resume', () => {
        console.log('[Reprise activité] — redémarrage du timer');
        mainWindow.webContents.send('start-timer');
    });
}

app.on('quit', () => {
    if (jsonServerProcess) {
        jsonServerProcess.kill();
    }
});

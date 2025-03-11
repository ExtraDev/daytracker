const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let jsonServerProcess;

app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-features', 'AutofillServerCommunication');

app.whenReady().then(() => {
    // Lancer json-server
    jsonServerProcess = spawn('node', [path.join(__dirname, '../node_modules/.bin/json-server'), '--watch', path.join(__dirname, '../src/app/common/mock/database.json')]);
    jsonServerProcess.stdout.on('data', (data) => {
        console.log(`json-server: ${data}`);
    });

    jsonServerProcess.stderr.on('data', (data) => {
        console.error(`json-server erreur: ${data}`);
    });

    // Créer la fenêtre Electron
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/daytracker/browser/index.html'));
    mainWindow.webContents.openDevTools();

    tray = new Tray(path.join(__dirname, 'assets', 'chronometer.png')); // Remplace avec ton icône
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Start', click: () => { } },
        { label: 'Pause', click: () => { } },
        { type: 'separator' },
        { label: 'Quitter', click: () => app.quit() }
    ]);
    tray.setToolTip('DayTracker');
    tray.setTitle(`Task name`);
    tray.setContextMenu(contextMenu);

    updateTrayText('');

    // 📡 Écoute les messages IPC venant d'Angular
    ipcMain.on('update-timer', (_, timerValue) => {
        updateTrayText(timerValue);
    });

    // 🔄 Fonction pour mettre à jour le texte du tray
    function updateTrayText(timerValue) {
        tray.setTitle(`⏳ ${timerValue}`);
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

// Arrêter json-server quand Electron se ferme
app.on('quit', () => {
    if (jsonServerProcess) {
        jsonServerProcess.kill();
    }
});

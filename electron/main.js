const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let jsonServerProcess;
let tray;
let tracks = [];

// 🔧 Désactiver certaines fonctionnalités pour améliorer les performances
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-features', 'AutofillServerCommunication');

// 🚀 Quand l'application est prête
app.whenReady().then(() => {
    console.log('Hello World :D');
    // 🟢 Démarrer json-server
    startJsonServer();

    // 🖥️ Créer la fenêtre Electron
    createMainWindow();

    // 📌 Configurer le Tray
    createTray();

    // 🎧 Écoute les messages IPC venant d'Angular
    setupIpcListeners();
});

// 🟢 Démarrer json-server
function startJsonServer() {
    jsonServerProcess = spawn('node', [
        path.join(__dirname, '../node_modules/.bin/json-server'),
        '--watch', path.join(__dirname, '../src/app/common/mock/database.json')
    ]);

    jsonServerProcess.stdout.on('data', (data) => console.log(`json-server: ${data}`));
    jsonServerProcess.stderr.on('data', (data) => console.error(`json-server erreur: ${data}`));
}

// 🖥️ Créer la fenêtre principale
function createMainWindow() {
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
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 📌 Créer et configurer le Tray
function createTray() {
    tray = new Tray(path.join(__dirname, 'assets', 'chronometer.png'));
    tray.setToolTip('DayTracker');
    tray.setTitle(`Task name`);
    updateContextMenu(); // Initialise le menu contextuel
    updateTrayText('');
}

// 🎧 Gestion des événements IPC
function setupIpcListeners() {
    ipcMain.on('update-timer', (_, timerValue) => updateTrayText(timerValue));
    ipcMain.on('start-timer', () => mainWindow.webContents.send('start-timer'));
    ipcMain.on('pause-timer', () => mainWindow.webContents.send('pause-timer'));
    ipcMain.on('update-menu', () => mainWindow.webContents.send('update-timer'));
    ipcMain.on('update-tracks', (event, newTracks) => {
        tracks = newTracks;
        console.log(tracks);
        updateContextMenu();
    });
}

// 🔄 Met à jour le menu contextuel du Tray
function updateContextMenu() {
    const trackItems = tracks.map(track => ({
        label: track.name,
        click: () => mainWindow.webContents.send('select-track', track)
    }));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Démarrer', click: () => mainWindow.webContents.send('start-timer') },
        { label: 'Pause', click: () => mainWindow.webContents.send('pause-timer') },
        { type: 'separator' },
        ...trackItems, // Ajoute dynamiquement les tracks ici
        { type: 'separator' },
        { label: 'Quitter', click: () => app.quit() }
    ]);

    tray.setContextMenu(contextMenu);
}

// 🕒 Met à jour le texte du Tray
function updateTrayText(timerValue) {
    tray.setTitle(`${timerValue}`);
}

// ❌ Arrêter json-server quand Electron se ferme
app.on('quit', () => {
    if (jsonServerProcess) {
        jsonServerProcess.kill();
    }
});

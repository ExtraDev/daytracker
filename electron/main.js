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

app.whenReady().then(() => {
    // 🟢 Définir l'icône du Dock sur macOS
    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, 'assets', 'icon.png'));
    }

    // 🟢 Démarrer json-server et ensuite seulement lancer la fenêtre
    startJsonServer().then(() => {
        createMainWindow(); // Seulement quand json-server est prêt
        createTray();
        setupIpcListeners();
    }).catch(err => {
        console.error('Erreur lors du démarrage de json-server :', err);
    });
});

// 🟢 Démarrer json-server (attend que ce soit prêt)
function startJsonServer() {
    return new Promise((resolve, reject) => {
        jsonServerProcess = spawn('node', [
            path.join(__dirname, '../node_modules/.bin/json-server'),
            '--watch',
            path.join(__dirname, '../src/app/common/mock/database.json')
        ]);

        jsonServerProcess.stdout.on('data', (data) => {
            const message = data.toString();
            console.log(`json-server: ${message}`);

            // ✅ Quand json-server est prêt, on résout
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
    //mainWindow.webContents.openDevTools();

    // 🛑 Confirmation de fermeture
    mainWindow.on('close', (event) => {
        const { response } = require('electron').dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Annuler', 'Quitter'],
            defaultId: 1,
            cancelId: 0,
            title: 'Confirmer',
            message: 'Es-tu sûr de vouloir quitter DayTracker ?'
        });

        console.log(response)
        if (response === 0) {
            event.preventDefault(); // ⛔️ Empêche la fermeture
        }
    });

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
    ipcMain.on('save-menu', () => mainWindow.webContents.send('save-timer'));
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
        { label: 'Sauvegarder', click: () => mainWindow.webContents.send('save-timer') },
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

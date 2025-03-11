const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),

    // tray actions
    updateTimer: (time) => ipcRenderer.send('update-timer', time),
    startTimer: () => ipcRenderer.send('start-timer'),
    pauseTimer: () => ipcRenderer.send('pause-timer'),
    onStartTimer: (callback) => ipcRenderer.on('start-timer', callback),
    onPauseTimer: (callback) => ipcRenderer.on('pause-timer', callback)
});

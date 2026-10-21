import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function criarJanela() {
    const janela = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1024,
        minHeight: 650,
        title: "Estrela do Oriente",
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    janela.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
        console.error("Erro ao carregar o aplicativo:", errorCode, errorDescription);
    });

    if (app.isPackaged) {
        janela.loadFile(path.join(__dirname, "../dist/index.html"));
    } else {
        janela.loadURL("http://localhost:5173");
    }
}

app.whenReady().then(() => {
    criarJanela();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            criarJanela();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
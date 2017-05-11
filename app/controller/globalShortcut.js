const electrin = require('electron');
const fs = require('fs');
//对话窗口
const dialog = electrin.dialog;

//键盘控制
const globalShortcut = electrin.globalShortcut;

let nowFile = 0;
let win;
let gsNow = 0;

exports.init = (app, oldWin) => {
    win = oldWin;
    globalShortcut.register('Ctrl+O', () => {
        if (gsNow != 0)
            return;
        gsNow = 1;
        dialog.showOpenDialog(
            win,
            {
                title: '打开md文件',
                filters: [
                    {name: 'Electron Markdown', extensions: ['md']},
                    {name: 'All Files', extensions: ['*']}
                ]
            },
            (data) => {
                if (data && data.length > 0) {
                    nowFile = data[0];
                    fs.readFile(nowFile, 'utf-8', function (err, data) {
                        if (err) {
                            throw err;
                        } else {
                            win.webContents.send('openFile', data);
                            win.webContents.send('updateFilePath', nowFile);
                        }
                    });
                }
                gsNow = 0;
            }
        );
    });
    globalShortcut.register('Ctrl+S', () => {
        if (gsNow != 0)
            return;
        gsNow = 1;
        win.webContents.send('save', '');
    });

//触发调试 Alt+F12
    globalShortcut.register('Alt+F12', () => {
        win.webContents.openDevTools();
    });

};
exports.saveMd = (md) => {
    if (!nowFile) {
        dialog.showSaveDialog(
            win,
            {
                title: '保存文档',
                buttonLabel: '保存文档',
                filters: [
                    {name: 'Electron Markdown', extensions: ['md']},
                    {name: 'All Files', extensions: ['*']}
                ]
            },
            (data) => {
                if (data) {
                    nowFile = data;
                    win.webContents.send('updateFilePath', nowFile);
                    saveFileMd(md);
                }else{
                    gsNow = 0;
                }

            }
        );
    } else {
        saveFileMd(md);
    }
};


let saveFileMd = (md) => {
    fs.writeFile(nowFile, md, 'utf-8', function (err) {
    });
    gsNow = 0;
};
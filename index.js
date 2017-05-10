/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const electrin = __webpack_require__(0);
const fs = __webpack_require__(2);
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
                }
                gsNow = 0;
            }
        );
    } else {
        saveFileMd(md);
    }
};


let saveFileMd = (md) => {
    fs.writeFile(nowFile, md, 'utf-8', function (err) {
    });
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

//通信模块，main process 与 renderer process (web page)
const {ipcMain}=__webpack_require__(0);
const {shell} = __webpack_require__(0);
const fs = __webpack_require__(2);


ipcMain.on('asynchronous-message', (event, arg) => {
    console.log('mian1' + arg);//prints ping
    //向页面端请求通讯
    event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', (event, arg) => {
    console.log('main2' + arg);//prints ping
    event.returnValue = 'pong';
});


//打开文件
// ipcMain.on('openFile', (event, arg) => {
//     shell.openItem(arg);
// });
//
// //打开网站
// ipcMain.on('openUrl', (event, arg) => {
//     shell.openExternal(arg);
// });


//-------------------


//判断文件夹或文件
let fsExistsSync = (path) => {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
};

let hosts = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
if (!fsExistsSync(hosts)) {
    hosts = '/etc/hosts';
    if (!fsExistsSync(hosts)) {
        hosts = false;
    }
}

//服务端获取Hosts
ipcMain.on('getHosts', (event, arg) => {
    fs.readFile(hosts, 'utf-8', function (err, data) {
        if (err) {
            throw err;
        } else {
            event.sender.send('setHosts', data.toString());
            // res.send(data.toString());
        }
    });
});

//保存Hosts
ipcMain.on('save', (event, arg) => {
    __webpack_require__(1).saveMd(arg);
});

module.exports = (app, win) => {
    //关闭
    ipcMain.on('close', (event, arg) => {
        app.quit();
    });
    //最大化
    ipcMain.on('max', (event, arg) => {
        win.isMaximized() ? win.unmaximize() : win.maximize();
        // win.setFullScreen(true);
    });
    //最小化
    ipcMain.on('min', (event, arg) => {
        win.minimize();
    });
};



/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {//electrin
const electrin = __webpack_require__(0);


//控制应用生命周期的模块
const {app} = electrin;

//创建本地浏览器窗口的模块
const {BrowserWindow} = electrin;

//指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的时候该窗口将会自动关闭
let win;

const path = __webpack_require__(4);
const url = __webpack_require__(5);

let openHtml = (html) => {
    win.loadURL(url.format({
        pathname: path.join(__dirname, html),
        protocol: 'file:',
        slashes: true
    }));
};

let createWindow = () => {
    //创建一个新的浏览器窗口
    //API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/browser-window.md
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 1000,
        minHeight: 700,
        // resizable: false,//禁止改变窗口大小
        icon: __dirname + '/icon/logo.png',//修改图标
        // skipTaskbar: false,//隐藏图标
        // kiosk:true, //默认全屏
        frame: false//设置成frame模式
        // API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/frameless-window.md
        // title:hidden
        // backgroundColor: 'transparent'
    });

    //并且装载应用的index.html页面
    openHtml('index.html');

    //打开开发工具页面
    // win.webContents.openDevTools();

    //当窗口关闭时调用的方法
    win.on('closed', () => {
        //解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里存放窗口对象，在窗口关闭的时候应当删除对应的元素。
        win = null;
    });

    //不显示菜单栏
    win.setMenu(null);

    //调试
    // win.webContents.openDevTools();

    __webpack_require__(1).init(app, win);
    __webpack_require__(3)(app, win);
};

//当electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。
//有些API只能在该事件发生后才能被使用。
app.on(
    'ready', createWindow
);

//当所有的窗口被关闭后退出应用
app.on(
    'window-all-closed', () => {
        //对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过CMD+Q显示退出
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

app.on(
    'activate', () => {
        //对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他窗口打开
        if (win === null) {
            createWindow();
        }
    }
);

//API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/menu.md
//API : https://github.com/electron/electron/blob/master/docs-translations/zh-CN/api/menu-item.md
//获取菜单
const Menu = __webpack_require__(0).Menu;
//自定义菜单那
let template = [
    {
        label: 'HOSTS ',
        click: () => {
            openHtml('index.html');
        }
    }, {
        label: 'CALCULATOR',
        click: () => {
            openHtml('html/calculator/index.html');
        }
    },
    // {
    //
    //     label: '其他',
    //     submenu: [
    //         {
    //             label: 'Undo',
    //             accelerator: 'CmdOrCtrl+M',
    //             role: 'minimize',
    //             click: () => {
    //                 console.log('Ctrl+Z');
    //             }
    //         }
    //     ]
    // }
];
let menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


//打包asar发布的时候 请注释
//自动刷新
// require('electron-reload')(__dirname, {
//     electron: require('electron-prebuilt')
// });

//
// app.on('will-quit', function () {
//     globalShortcut.unregisterAll()
// });

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ })
/******/ ]);
const {ipcRenderer} = require('electron');
const markdown = require('markdown').markdown;

// require('./jquery.min');

// //向客户端发送请求 获取Hosts
// ipcRenderer.send('getHosts', '');
//
// //设置web端回调
ipcRenderer.on('save', (event, arg) => {
    keyUp();
    ipcRenderer.send('save', md.value);
});

// //设置web端回调
ipcRenderer.on('updateFilePath', (event, arg) => {
    savePath.innerHTML = '[ ' + arg + ' ]';
});

//打开文件
ipcRenderer.on('openFile', (event, arg) => {
    md.value = arg;
    keyUp();
});


let container = document.getElementById('container');
let md = document.getElementById('md');
let html = document.getElementById('html');
let min = document.getElementById('min');
let max = document.getElementById('max');
let close = document.getElementById('close');
let header = document.getElementById('header');
let savePath = document.getElementById('savePath');

let keyUp = () => {
    let htmlCode = markdown.toHTML(md.value);
    html.innerHTML = htmlCode;
};
keyUp();
// container.find


min.onclick = () => {
    ipcRenderer.send('min', '');
};

max.onclick = () => {
    ipcRenderer.send('max', '');
};

close.onclick = () => {
    ipcRenderer.send('close', '');
};


let windowSizeUpdata = () => {
    let wh = window.innerHeight;
    container.style.height = (wh - 50) + 'px';
    md.style.height = (wh - 50) + 'px';
    html.style.height = (wh - 50) + 'px';
};

windowSizeUpdata();
window.onresize = () => {
    windowSizeUpdata();
};
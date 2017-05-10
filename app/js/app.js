const {ipcRenderer} = require('electron');
const markdown = require('markdown').markdown;

// require('./jquery.min');

// //向客户端发送请求 获取Hosts
// ipcRenderer.send('getHosts', '');
//
// //设置web端回调
// ipcRenderer.on('setHosts', (event, arg) => {
//     setListData(arg);
// });

let container = document.getElementById('container');
let md = document.getElementById('md');
let html = document.getElementById('html');
let min = document.getElementById('min');
let max = document.getElementById('max');
let close = document.getElementById('close');
let header = document.getElementById('header');


let keyUp = () => {
    let htmlCode = markdown.toHTML(md.value);
    console.log(html, md.value);
    html.innerHTML = htmlCode;
    // html.appendChild()
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

header.ondblclick = () => {
    alert(1);
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
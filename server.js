const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public')); // HTMLやCSS, JSを置く

let clones = []; // 現在のクローン状態を管理

io.on('connection', (socket) => {
    console.log('A user connected');

    // 現在のクローン状態を新規接続者に送る
    socket.emit('sync', clones);

    // クローンが増えたら全員に送信
    socket.on('newClone', (data) => {
        clones.push(data);
        io.emit('newClone', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

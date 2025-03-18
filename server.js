const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public')); // 静的ファイルを提供

let clones = []; // 現在のクローンデータを管理
let users = {};  // 接続ユーザーを管理

io.on('connection', (socket) => {
    console.log('A user connected');

    // ユーザーIDを作成
    let userId = "user" + Math.floor(Math.random() * 1000);
    users[socket.id] = userId;

    // 参加通知を全員に送信
    io.emit('chatMessage', { user: "システム", message: `${userId} が参加しました。` });

    // 既存のクローン情報を新規接続ユーザーに送信
    socket.emit('sync', clones);

    // 新しいクローンを受信して全員に送信
    socket.on('newClone', (data) => {
        clones.push(data);
        io.emit('newClone', data);
    });

    // チャットメッセージの受信
    socket.on('chatMessage', (message) => {
        io.emit('chatMessage', { user: users[socket.id], message });
    });

    // ユーザー切断時の処理
    socket.on('disconnect', () => {
        io.emit('chatMessage', { user: "システム", message: `${users[socket.id]} が退出しました。` });
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

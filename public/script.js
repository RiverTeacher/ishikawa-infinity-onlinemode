var socket = io(); // サーバーと接続

var $btn = document.querySelector('#js-btn');
var $wrapper = document.querySelector('#js-wrapper');
var $originalItem = document.querySelectorAll('.original__item');

var easingName = [
    'Back.easeInOut.config(1.7)',
    'Elastic.easeInOut.config(1, 0.3)',
    'Bounce.easeInOut',
    'ease: Circ.easeInOut'
];

// 新規接続時に過去のクローンを受け取り、再描画
socket.on('sync', function(existingClones) {
    existingClones.forEach(data => {
        createClone(data);
    });
});

$btn.addEventListener('click', function() {
    const randNum = Math.floor(Math.random() * $originalItem.length);

    // 位置情報をランダムに生成
    var expandAnime = {
        x: Math.floor(Math.random() * window.innerWidth - window.innerWidth / 2),
        y: Math.floor(Math.random() * window.innerHeight - window.innerHeight / 2),
        rotation: Math.floor(Math.random() * 720 - 360),
        scale: 0.2 + Math.random(),
        duration: 0.5 + Math.random() * 2.0,
        ease: easingName[Math.floor(Math.random() * easingName.length)]
    };

    // サーバーに送信 (自分の画面では何もしない)
    socket.emit('newClone', expandAnime);
});

// 他のクライアント (自分含む) からの増殖を受信
socket.on('newClone', function(expandAnime) {
    createClone(expandAnime);
});

function createClone(data) {
    const randNum = Math.floor(Math.random() * $originalItem.length);
    const $clone = $originalItem[randNum].cloneNode(true);
    $wrapper.appendChild($clone);

    TweenMax.to($clone, data.duration, {
        x: data.x,
        y: data.y,
        rotation: data.rotation,
        ease: data.ease,
        scale: data.scale
    });
}

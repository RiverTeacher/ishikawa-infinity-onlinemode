var socket = io();

var $btn = document.querySelector('#js-btn');
var $wrapper = document.querySelector('#js-wrapper');
var $originalItem = document.querySelectorAll('.original__item');

// ロード画面を表示
var loadingScreen = document.getElementById("loading-screen");
loadingScreen.classList.remove("hidden");

// サーバーから同期データを受信
socket.on('sync', function(existingClones) {
    console.log("同期データを受信:", existingClones);

    // クローンが 0 なら即ロード画面を非表示
    if (existingClones.length === 0) {
        console.log("データなし、ロード画面を消す");
        loadingScreen.classList.add("hidden");
        return;
    }

    // 既存のクローンを描画
    existingClones.forEach(data => {
        createClone(data);
    });

    // 受信完了後にロード画面を非表示 (1秒待つ)
    setTimeout(() => {
        console.log("ロード完了、画面を消す");
        loadingScreen.classList.add("hidden");
    }, 1000);
});

$btn.addEventListener('click', function() {
    var expandAnime = {
        x: Math.random() * window.innerWidth - window.innerWidth / 2,
        y: Math.random() * window.innerHeight - window.innerHeight / 2,
        rotation: Math.random() * 720 - 360,
        scale: 0.2 + Math.random(),
        duration: 0.5 + Math.random() * 2.0
    };

    socket.emit('newClone', expandAnime);
});

socket.on('newClone', function(expandAnime) {
    createClone(expandAnime);
});

function createClone(data) {
    const $clone = $originalItem[0].cloneNode(true);
    $wrapper.appendChild($clone);

    TweenMax.to($clone, data.duration, {
        x: data.x,
        y: data.y,
        rotation: data.rotation,
        scale: data.scale
    });
}


document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM 読み込み完了");

    const chatToggle = document.getElementById("chat-toggle");
    const chatBox = document.getElementById("chat-box");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");

    if (!chatToggle || !chatBox || !chatMessages || !chatInput || !chatSend) {
        console.error("❌ 必要な要素が見つかりません！");
        return;
    }

    // チャットボックスの開閉
    chatToggle.addEventListener("click", function () {
        console.log("✅ チャットボタンがクリックされました");

        if (chatBox.classList.contains("chat-visible")) {
            chatBox.classList.remove("chat-visible");
            chatBox.classList.add("chat-hidden");
            console.log("❌ チャットボックスを非表示");
        } else {
            chatBox.classList.remove("chat-hidden");
            chatBox.classList.add("chat-visible");
            console.log("✅ チャットボックスを表示");
        }
    });

    // **✅ 初回に「●●が参加しました」を表示**
    function addSystemMessage(message) {
        const systemMsg = document.createElement("div");
        systemMsg.textContent = message;
        systemMsg.style.color = "gray"; // システムメッセージは灰色
        chatMessages.appendChild(systemMsg);
    }
    addSystemMessage("🟢 あなたがチャットに参加しました");

    // **✅ メッセージを追加する関数**
    function addMessage(user, message) {
        if (!message.trim()) return; // 空白だけのメッセージは無視

        const msg = document.createElement("div");
        msg.innerHTML = `<strong>${user}:</strong> ${message}`;
        chatMessages.appendChild(msg);

        chatInput.value = ""; // 入力欄をクリア
        chatMessages.scrollTop = chatMessages.scrollHeight; // 最新メッセージを表示
    }

    // **✅ 送信ボタンのクリック処理**
    chatSend.addEventListener("click", function () {
        console.log("✅ 送信ボタンがクリックされました");
        const message = chatInput.value;
        addMessage("あなた", message);
    });

    // **✅ Enter キーでも送信**
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            chatSend.click();
        }
    });
});







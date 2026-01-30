
"use strict";

let flag = "pen-flag";
let counter = 9;

const squares = document.getElementsByClassName("square");
const squaresArray = Array.from(squares);

const msgtxt1 = '<p class="image"><img src="img/penguins.jpg" width=61px height=61px></p><p class="text">Penguins Attack!</p>';
const msgtxt2 = '<p class="image"><img src="img/whitebear.jpg" width=61px height=61px></p><p class="text">Whitebear Attack!</p>';
const msgtxt3 = '<p class="image"><img src="img/penguins.jpg" width=61px height=61px></p><p class="text animate__animated animate__lightSpeedInRight">Penguins Win!!</p>';
const msgtxt4 = '<p class="image"><img src="img/whitebear.jpg" width=61px height=61px></p><p class="text animate__animated animate__lightSpeedInLeft">WhiteBear Win!!</p>';
const msgtxt5 = '<p class="image"><img src="img/penguins.jpg" width=61px height=61px><img src="img/whitebear.jpg" width=61px height=61px></p><p class="text animate__animated animate__bounceIn">Draw!!</p>';

let gameSound = ["sound/click_sound1.mp3", "sound/click_sound2.mp3", "sound/penwin_sound.mp3", "sound/bearwin_sound.mp3", "sound/draw_sound.mp3"];

const newgameBtnEl = document.getElementById("newgame-btn");
const newgameContainer = document.getElementById("newgame-container");

function JudgLine(targetArray, idArray) {
    return targetArray.filter(e => idArray.includes(e.id));
}

const lineArray = [
    JudgLine(squaresArray, ["a_1", "a_2", "a_3"]), JudgLine(squaresArray, ["b_1", "b_2", "b_3"]),
    JudgLine(squaresArray, ["c_1", "c_2", "c_3"]), JudgLine(squaresArray, ["a_1", "b_1", "c_1"]),
    JudgLine(squaresArray, ["a_2", "b_2", "c_2"]), JudgLine(squaresArray, ["a_3", "b_3", "c_3"]),
    JudgLine(squaresArray, ["a_1", "b_2", "c_3"]), JudgLine(squaresArray, ["a_3", "b_2", "c_1"])
];

window.addEventListener("DOMContentLoaded", () => setMessage("pen-turn"));

squaresArray.forEach(square => {
    square.addEventListener("click", () => isSelect(square));
});

function musicPlay(path) {
    let audio = new Audio();
    audio.src = path;
    audio.play();
}

function isSelect(selectSquare) {
    if (flag === "pen-flag") {
        musicPlay(gameSound[0]);
        selectSquare.classList.add("js-pen-checked", "js-unclickable");
        // --- 修改点：检查获胜并获取那条线 ---
        let winLine = getWinLine("penguins");
        if (winLine) {
            winLine.forEach(sq => sq.classList.add("js-pen_highLight")); // 添加红框
            setMessage("pen-win");
            gameOver("penguins");
            return;
        }
        setMessage("bear-turn");
        flag = "bear-flag";
    } else {
        musicPlay(gameSound[1]);
        selectSquare.classList.add("js-bear-checked", "js-unclickable");
        // --- 修改点：检查获胜并获取那条线 ---
        let winLine = getWinLine("bear");
        if (winLine) {
            winLine.forEach(sq => sq.classList.add("js-bear_highLight")); // 添加蓝框
            setMessage("bear-win");
            gameOver("bear");
            return;
        }
        setMessage("pen-turn");
        flag = "pen-flag";
    }
    counter--;
    if (counter === 0) {
        setMessage("draw");
        gameOver("draw");
    }
}

// --- 修改后的判断逻辑：返回获胜的那组方格 ---
function getWinLine(symbol) {
    const checkClass = symbol === "penguins" ? "js-pen-checked" : "js-bear-checked";
    // 找到那条全部符合条件的线并返回
    return lineArray.find(line => line.every(sq => sq.classList.contains(checkClass)));
}

function setMessage(id) {
    const target = document.getElementById("msgtext");
    switch (id) {
        case "pen-turn": target.innerHTML = msgtxt1; break;
        case "bear-turn": target.innerHTML = msgtxt2; break;
        case "pen-win": target.innerHTML = msgtxt3; break;
        case "bear-win": target.innerHTML = msgtxt4; break;
        case "draw": target.innerHTML = msgtxt5; break;
    }
}

function gameOver(status) {
    squaresArray.forEach(sq => sq.classList.add("js-unclickable"));
    newgameContainer.classList.remove("js-hidden");
    if (status === "penguins") musicPlay(gameSound[2]);
    else if (status === "bear") musicPlay(gameSound[3]);
    else if (status === "draw") musicPlay(gameSound[4]);

    if (status === "penguins" || status === "bear") {
        $(document).snowfall({
            flakeColor: status === "penguins" ? "rgb(255,240,245)" : "rgb(240,248,255)",
            maxSize: 20, minSize: 10, round: true
        });
    }
}

newgameBtnEl.addEventListener("click", () => {
    flag = "pen-flag";
    counter = 9;
    squaresArray.forEach(sq => {
        // 重置时记得移除高亮类
        sq.classList.remove("js-pen-checked", "js-bear-checked", "js-unclickable", "js-pen_highLight", "js-bear_highLight");
    });
    setMessage("pen-turn");
    newgameContainer.classList.add("js-hidden");
    $(document).snowfall('clear');
});



import { Game } from "./Game.js";
import { InputController } from "./InputController.js";
import { levels } from "./levels.js";
import { createBoard, drawGame } from "./draw.js";

function getElement(id) {
    return document.getElementById(id);
}

const ui = {
    board: getElement("board"),
    boardBody: getElement("board-body"),
    levelSelect: getElement("level-select"),
    description: getElement("level-description"),

    startButton: getElement("start-button"),
    pauseButton: getElement("pause-button"),

    currentLevel: getElement("current-level"),
    score: getElement("score"),
    foodCount: getElement("food-count"),
    target: getElement("target"),
    status: getElement("status")
};

function hideUnusedElements() {
    const unusedIds = [
        "next-button",
        "bot-info",
        "time-info",
        "food-time-info",
        "reverse-info",
        "visibility-note"
    ];

    for (const id of unusedIds) {
        const element = getElement(id);

        // Các phần tử phụ có thể đã được người dùng bỏ khỏi HTML.
        if (element !== null) {
            element.hidden = true;
        }
    }

    const nextButton = getElement("next-button");

    if (nextButton !== null) {
        nextButton.disabled = true;
    }
}

function populateLevelSelect() {
    // Thay danh sách cũ, tránh giữ lại option của các màn đã bỏ.
    ui.levelSelect.replaceChildren();

    for (const level of levels) {
        const option = document.createElement("option");

        option.value = level.id;
        option.textContent = level.id + ". " + level.name;

        ui.levelSelect.append(option);
    }
}

function getSelectedLevel() {
    const selectedId = Number(ui.levelSelect.value);

    return levels.find(function (level) {
        return level.id === selectedId;
    });
}

function showDescription() {
    const selectedLevel = getSelectedLevel();

    if (selectedLevel) {
        ui.description.textContent = selectedLevel.description;
    }
}

hideUnusedElements();
populateLevelSelect();
showDescription();

const game = new Game();

let cells = createBoard(
    ui.boardBody,
    levels[0].rows,
    levels[0].columns
);

let lastFrameTime = null;

ui.pauseButton.disabled = true;
ui.target.textContent = levels[0].targetFoods;
ui.status.textContent = game.message;

function render() {
    drawGame(game, cells, ui);
}

function startGame() {
    const selectedLevel = getSelectedLevel();

    if (!selectedLevel) {
        return;
    }

    game.start(selectedLevel);

    cells = createBoard(
        ui.boardBody,
        game.rows,
        game.columns
    );

    lastFrameTime = null;
    render();

    // Trả bàn phím về điều khiển game sau khi bấm nút.
    ui.startButton.blur();
}

function togglePause() {
    game.togglePause();
    render();
    ui.pauseButton.blur();
}

function handleLevelChange() {
    if (game.status === "playing") {
        game.togglePause();
    }

    showDescription();
    render();
    ui.levelSelect.blur();
}

ui.startButton.addEventListener("click", startGame);
ui.pauseButton.addEventListener("click", togglePause);
ui.levelSelect.addEventListener("change", handleLevelChange);

const input = new InputController(game, render);

// Chỉ gắn sự kiện một lần, không gắn lại mỗi khi chơi lại.
input.attach();

function loop(currentTime) {
    if (lastFrameTime === null) {
        lastFrameTime = currentTime;
    }

    const deltaMs = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    game.update(deltaMs);
    render();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
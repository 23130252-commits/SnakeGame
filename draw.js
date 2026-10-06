import { CELL } from "./levels.js";

export function createBoard(boardBody, rows, columns) {
    boardBody.replaceChildren();

    const cells = [];

    for (let y = 0; y < rows; y++) {
        const rowElement = document.createElement("tr");
        rowElement.className = "board-row";

        cells[y] = [];

        for (let x = 0; x < columns; x++) {
            const cellElement = document.createElement("td");

            cellElement.className = "cell cell--empty";
            cellElement.dataset.x = x;
            cellElement.dataset.y = y;

            const symbolElement = document.createElement("span");
            symbolElement.className = "cell-symbol";
            symbolElement.textContent = "·";

            cellElement.append(symbolElement);
            rowElement.append(cellElement);

            cells[y][x] = cellElement;
        }

        boardBody.append(rowElement);
    }

    return cells;
}

function getDirectionName(direction) {
    if (direction.x > 0) {
        return "right";
    }

    if (direction.x < 0) {
        return "left";
    }

    if (direction.y > 0) {
        return "down";
    }

    return "up";
}

export function drawGame(game, cells, ui) {
    if (game.level === null) {
        return;
    }

    const headSymbols = {
        up: "↑",
        down: "↓",
        left: "←",
        right: "→"
    };

    for (let y = 0; y < game.rows; y++) {
        for (let x = 0; x < game.columns; x++) {
            const cellCode = game.grid[y][x];

            let className = "cell cell--empty";
            let symbol = "·";
            let label = "Ô trống";

            if (cellCode === CELL.FOOD) {
                className = "cell cell--food";
                symbol = "●";
                label = "Thức ăn";
            } else if (cellCode === CELL.PLAYER) {
                className = "cell cell--player-body";
                symbol = "○";
                label = "Thân rắn người";
            }

            const isHead =
                game.player.head.x === x
                && game.player.head.y === y;

            if (isHead) {
                const directionName = getDirectionName(
                    game.player.direction
                );

                className = "cell cell--player-head";
                className += " direction-" + directionName;

                symbol = headSymbols[directionName];
                label = "Đầu rắn người";

                if (!game.player.alive) {
                    className += " is-dead";
                }
            }

            const cellElement = cells[y][x];
            const symbolElement = cellElement.firstElementChild;

            if (cellElement.className !== className) {
                cellElement.className = className;
            }

            if (symbolElement.textContent !== symbol) {
                symbolElement.textContent = symbol;
            }

            cellElement.setAttribute("aria-label", label);
        }
    }

    ui.board.dataset.status = game.status;

    ui.currentLevel.textContent =
        game.level.id + ". " + game.level.name;

    ui.score.textContent = game.player.score;
    ui.foodCount.textContent = game.player.foodsEaten;
    ui.target.textContent = game.level.targetFoods;

    if (ui.status.textContent !== game.message) {
        ui.status.textContent = game.message;
    }

    if (game.status === "playing") {
        ui.pauseButton.disabled = false;
        ui.pauseButton.textContent = "Tạm dừng";
    } else if (game.status === "paused") {
        ui.pauseButton.disabled = false;
        ui.pauseButton.textContent = "Tiếp tục";
    } else {
        ui.pauseButton.disabled = true;
        ui.pauseButton.textContent = "Tạm dừng";
    }
}
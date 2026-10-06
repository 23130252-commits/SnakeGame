import { Snake } from "./Snake.js";
import { CELL, DIRECTIONS } from "./levels.js";

export class Game {
    constructor() {
        this.level = null;
        this.player = null;
        this.food = null;
        this.grid = [];

        this.rows = 0;
        this.columns = 0;
        this.accumulatorMs = 0;

        this.status = "ready";
        this.message = "Chọn màn rồi bấm Bắt đầu.";
    }

    start(level) {
        this.level = level;
        this.rows = level.rows;
        this.columns = level.columns;

        const startingBody = [
            { x: 4, y: 3 },
            { x: 3, y: 3 },
            { x: 2, y: 3 }
        ];

        this.player = new Snake(
            startingBody,
            DIRECTIONS.right
        );

        this.food = null;
        this.accumulatorMs = 0;
        this.status = "playing";
        this.message = "Đang chơi.";

        this.spawnFood();
    }

    rebuildGrid() {
        this.grid = [];

        for (let y = 0; y < this.rows; y++) {
            const row = [];

            for (let x = 0; x < this.columns; x++) {
                row.push(CELL.EMPTY);
            }

            this.grid.push(row);
        }

        if (this.food !== null) {
            this.grid[this.food.y][this.food.x] = CELL.FOOD;
        }

        for (const position of this.player.body) {
            this.grid[position.y][position.x] = CELL.PLAYER;
        }
    }

    spawnFood() {
        this.food = null;
        this.rebuildGrid();

        const emptyCells = [];

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                if (this.grid[y][x] === CELL.EMPTY) {
                    emptyCells.push({
                        x: x,
                        y: y
                    });
                }
            }
        }
        const randomIndex = Math.floor(
            Math.random() * emptyCells.length
        );

        this.food = emptyCells[randomIndex];
        this.rebuildGrid();
    }

    getNextPosition(position, direction) {
        let nextX = position.x + direction.x;
        let nextY = position.y + direction.y;

        if (this.level.wrap) {
            nextX = (nextX + this.columns) % this.columns;
            nextY = (nextY + this.rows) % this.rows;
        }
        return {
            x: nextX,
            y: nextY
        };
    }

    sameCell(firstPosition, secondPosition) {
        if (firstPosition === null || secondPosition === null) {
            return false;
        }

        return firstPosition.x === secondPosition.x
            && firstPosition.y === secondPosition.y;
    }

    hitsOwnBody(nextHead, willGrow) {
        let bodyPartsToCheck = this.player.body.length;

        // Không ăn thì đuôi rời đi trong bước này.
        // Vì vậy, đầu được phép đi vào ô đuôi đang rời đi.
        if (!willGrow) {
            bodyPartsToCheck--;
        }

        for (let index = 0; index < bodyPartsToCheck; index++) {
            const bodyPosition = this.player.body[index];

            if (this.sameCell(nextHead, bodyPosition)) {
                return true;
            }
        }

        return false;
    }

    changeDirection(direction) {
        if (this.status !== "playing") {
            return false;
        }

        return this.player.setDirection(direction);
    }

    togglePause() {
        if (this.status === "playing") {
            this.status = "paused";
            this.message = "Đã tạm dừng.";
        } else if (this.status === "paused") {
            this.status = "playing";
            this.message = "Đang chơi.";
        }
    }

    finish(status, message) {
        this.status = status;
        this.message = message;
    }

    update(deltaMs) {
        if (this.status !== "playing") {
            return;
        }

        this.accumulatorMs += deltaMs;

        // Chỉ di chuyển khi đã tích lũy đủ thời gian cho một bước.
        while (
            this.accumulatorMs >= this.level.stepMs
            && this.status === "playing"
            ) {
            this.accumulatorMs -= this.level.stepMs;
            this.step();
        }
    }

    step() {
        if (this.status !== "playing") {
            return;
        }

        const nextHead = this.getNextPosition(
            this.player.head,
            this.player.nextDirection
        );

        if (nextHead === null) {
            this.player.alive = false;
            this.finish("lost", "Bạn đã chạm biên.");
            return;
        }

        const willGrow = this.sameCell(nextHead, this.food);

        if (this.hitsOwnBody(nextHead, willGrow)) {
            this.player.alive = false;
            this.finish("lost", "Rắn đã tự cắn mình.");
            return;
        }

        this.player.move(nextHead, willGrow);

        if (willGrow) {
            this.player.score += this.level.pointsPerFood;
            this.player.foodsEaten++;
            this.food = null;
        }

        this.rebuildGrid();

        if (this.player.foodsEaten >= this.level.targetFoods) {
            this.finish("won", "Bạn đã ăn đủ mục tiêu. Bạn thắng!");
            return;
        }

        if (willGrow) {
            this.spawnFood();
        }
    }
}
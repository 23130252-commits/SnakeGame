import { DIRECTIONS } from "./levels.js";

export class Snake {
    constructor(body, direction) {
        // Sao chép từng tọa độ để thân rắn có dữ liệu riêng.
        this.body = body.map(function (position) {
            return {
                x: position.x,
                y: position.y
            };
        });

        this.direction = {
            x: direction.x,
            y: direction.y
        };

        this.nextDirection = {
            x: direction.x,
            y: direction.y
        };

        this.turnQueued = false;
        this.alive = true;
        this.score = 0;
        this.foodsEaten = 0;
    }

    get head() {
        return this.body[0];
    }

    setDirection(direction) {
        if (!this.alive || this.turnQueued || !direction) {
            return false;
        }

        const validDirection = Object.values(DIRECTIONS).some(
            function (allowedDirection) {
                return allowedDirection.x === direction.x
                    && allowedDirection.y === direction.y;
            }
        );

        if (!validDirection) {
            return false;
        }

        const isReverse =
            direction.x === -this.direction.x
            && direction.y === -this.direction.y;

        const isUnchanged =
            direction.x === this.direction.x
            && direction.y === this.direction.y;

        if (isReverse || isUnchanged) {
            return false;
        }

        this.nextDirection = {
            x: direction.x,
            y: direction.y
        };

        // Chỉ nhận một lần rẽ trong mỗi bước di chuyển.
        this.turnQueued = true;

        return true;
    }

    move(nextHead, grow) {
        this.body.unshift({
            x: nextHead.x,
            y: nextHead.y
        });

        // Không ăn thì bỏ đuôi; ăn thì giữ đuôi để dài thêm.
        if (!grow) {
            this.body.pop();
        }

        this.direction = {
            x: this.nextDirection.x,
            y: this.nextDirection.y
        };

        this.turnQueued = false;
    }
}
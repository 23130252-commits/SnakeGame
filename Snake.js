import { DIRECTIONS } from './levels.js';

export class Snake {
    constructor(id, body, direction = DIRECTIONS.right) {
        this.id = id;
        // Sao chép từng tọa độ.
        this.body = body.map(part => ({ x: part.x, y: part.y }));
        this.direction = { ...direction };
        this.nextDirection = { ...direction };
        this.turnQueued = false;
        this.alive = true;
        this.score = 0;
        this.foodsEaten = 0;
    }

    get head() { return this.body[0]; }

    setDirection(direction) {
        if (!this.alive || this.turnQueued) return false;
        const valid = Object.values(DIRECTIONS).some(d => d.x === direction.x && d.y === direction.y);
        if (!valid) return false;
        const reverse = direction.x === -this.direction.x && direction.y === -this.direction.y;
        const unchanged = direction.x === this.direction.x && direction.y === this.direction.y;
        if (reverse || unchanged) return false;
        this.nextDirection = { ...direction };
        // Khóa một lần rẽ/bước: chặn bấm lên rồi trái quá nhanh khi đang đi phải.
        this.turnQueued = true;
        return true;
    }

    move(nextHead, grow) {
        this.body.unshift({ ...nextHead });
        if (!grow) this.body.pop();
        this.direction = { ...this.nextDirection };
        this.turnQueued = false;
    }
}

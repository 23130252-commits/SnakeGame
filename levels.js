export const CELL = {
    EMPTY: 0,
    PLAYER: 2,
    FOOD: 9
};

export const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

const common = {
    rows: 20,
    columns: 20,
    stepMs: 160,
    targetFoods: 5,
    pointsPerFood: 10,
    wrap: true
};

export const levels = [
    Object.assign({}, common, {
        id: 1,
        name: "Classic",
        description:
            "Ăn đủ 5 thức ăn để thắng. Đi qua biên sẽ xuất hiện ở mép đối diện."
    })
];
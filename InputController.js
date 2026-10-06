import { DIRECTIONS } from "./levels.js";

export class InputController {
    constructor(game, onChange) {
        this.game = game;
        this.onChange = onChange;

        this.keys = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
            w: "up",
            s: "down",
            a: "left",
            d: "right"
        };

        // Giữ "this" là đối tượng InputController khi xử lý sự kiện.
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleDirectionClick =
            this.handleDirectionClick.bind(this);
    }

    attach() {
        document.addEventListener(
            "keydown",
            this.handleKeyDown
        );

        const directionButtons = document.querySelectorAll(
            "[data-direction]"
        );

        for (const button of directionButtons) {
            button.addEventListener(
                "click",
                this.handleDirectionClick
            );
        }
    }

    handleDirectionClick(event) {
        const button = event.currentTarget;
        const directionName = button.dataset.direction;
        const direction = DIRECTIONS[directionName];

        if (direction) {
            this.game.changeDirection(direction);
        }

        button.blur();
        this.onChange();
    }

    handleKeyDown(event) {
        // Không chiếm phím khi đang thao tác với phần tử nhập liệu.
        const formElement = event.target.closest(
            "input, textarea, select, button, [contenteditable='true']"
        );

        if (formElement) {
            return;
        }

        let directionName = this.keys[event.key];

        if (directionName === undefined) {
            directionName = this.keys[event.key.toLowerCase()];
        }

        if (directionName !== undefined) {
            event.preventDefault();

            const direction = DIRECTIONS[directionName];
            this.game.changeDirection(direction);
            this.onChange();

            return;
        }

        if (event.code === "Space") {
            event.preventDefault();

            if (!event.repeat) {
                this.game.togglePause();
                this.onChange();
            }
        }
    }
}
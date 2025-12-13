export default class GameClock {
    constructor(minutes = 10, increment = 0, onTick) {
        this.timeWhite = minutes * 60;
        this.timeBlack = minutes * 60;
        this.increment = increment; // seconds
        this.onTick = onTick; // callback(whiteTime, blackTime)

        this.activeColor = null; // 'w' or 'b'
        this.interval = null;
        this.lastTime = 0;
    }

    start(color) {
        if (this.activeColor === color && this.interval) return;

        this.stop();
        this.activeColor = color;
        this.lastTime = Date.now();

        this.interval = setInterval(() => {
            const now = Date.now();
            const delta = (now - this.lastTime) / 1000;
            this.lastTime = now;

            if (this.activeColor === 'w') {
                this.timeWhite -= delta;
                if (this.timeWhite <= 0) {
                    this.timeWhite = 0;
                    this.stop();
                    // Timeout callback could be added here
                }
            } else {
                this.timeBlack -= delta;
                if (this.timeBlack <= 0) {
                    this.timeBlack = 0;
                    this.stop();
                }
            }

            if (this.onTick) this.onTick(this.timeWhite, this.timeBlack);

        }, 100);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    switchTurn() {
        // Add increment to the player who just finished their turn
        if (this.activeColor === 'w') {
            this.timeWhite += this.increment;
            this.start('b');
        } else if (this.activeColor === 'b') {
            this.timeBlack += this.increment;
            this.start('w');
        } else {
            // First move
            this.start('w');
        }
        // Immediate update to show increment
        if (this.onTick) this.onTick(this.timeWhite, this.timeBlack);
    }

    reset(minutes) {
        this.stop();
        this.timeWhite = minutes * 60;
        this.timeBlack = minutes * 60;
        this.activeColor = null;
        if (this.onTick) this.onTick(this.timeWhite, this.timeBlack);
    }
}

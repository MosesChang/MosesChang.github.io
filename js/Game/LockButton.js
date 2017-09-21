var LockButton = (function () {
    function LockButton(inLevel, inButton) {
        this.level = inLevel;
        this.level.onUpdate.add(this.update, this);
        this.regButton = inButton;
        this.isLock = false;
        this.justLock = false;
        this.lockable = true;
        this.regButton.onInputDown.add(this.OnBtDown, this);
        this.regButton.onInputUp.add(this.OnBtUp, this);
        this.pressed = false;
        this.pressTime = 0;
        this.LOCK_TIME = 0.6;
        this.shouldEnabled = true;
    }
    LockButton.prototype.setEnabled = function (inEnabled) {
        this.shouldEnabled = inEnabled;
        if (this.isLock)
            return;
        if (inEnabled) {
            if (!this.regButton.inputEnabled) {
                this.regButton.inputEnabled = true;
                this.regButton.setFrames(0, 0, 1, 0);
            }
        }
        else {
            this.pressed = false;
            this.pressTime = 0;
            if (this.regButton.inputEnabled) {
                this.regButton.inputEnabled = false;
                this.regButton.setFrames(2, 2, 2, 2);
            }
        }
    };
    LockButton.prototype.update = function (deltaTime) {
        if (this.isLock || !this.pressed)
            return;
        this.pressTime += deltaTime;
        if (this.pressTime >= this.LOCK_TIME && this.lockable) {
            this.pressed = false;
            this.pressTime = 0;
            if (this.shouldEnabled) {
                this.isLock = true;
                this.justLock = true;
                this.regButton.setFrames(1, 1, 1, 1);
                this.level.game.sound.play("CS_PressBt");
            }
        }
    };
    LockButton.prototype.OnBtDown = function () {
        if (!this.shouldEnabled)
            return;
        this.justLock = false;
        if (!this.isLock) {
            this.pressed = true;
            this.pressTime = 0;
        }
    };
    LockButton.prototype.OnBtUp = function () {
        this.pressed = false;
        this.pressTime = 0;
        if (this.isLock && !this.justLock) {
            this.isLock = false;
            if (this.shouldEnabled) {
                this.regButton.inputEnabled = true;
                this.regButton.setFrames(0, 0, 1, 0);
            }
            else {
                this.regButton.inputEnabled = false;
                this.regButton.setFrames(2, 2, 2, 2);
            }
        }
        this.justLock = false;
    };
    return LockButton;
}());

// CAUTION, use this trigger no need to register Phaser.Button's default button callback
//   otherwise it will call the callback when the button final Up in trigger mode
var TriggerButton = (function () {
    function TriggerButton(inLevel, inButton, inBtReturnID) {
        inLevel.onUpdate.add(this.update, this);
        this.regButton = inButton;
        this.btReturnID = inBtReturnID;
        this.regButton.onInputDown.add(this.OnBtDown, this);
        this.regButton.onInputUp.add(this.OnBtUp, this);
        this.pressed = false;
        this.pressTime = 0;
        this.TRIGGER_TIME = 0.4;
        this.onTrigger = new Phaser.Signal();
        this.triggered = false;
        this.enabled = true;
    }
    TriggerButton.prototype.setEnabled = function (inEnabled) {
        if (this.enabled == inEnabled)
            return;
        this.enabled = inEnabled;
        if (inEnabled) {
            this.regButton.inputEnabled = true;
            this.regButton.setFrames(0, 0, 1, 0);
        }
        else {
            this.regButton.inputEnabled = false;
            this.regButton.setFrames(2, 2, 2, 2);
            if (this.pressed) {
                this.pressed = false;
                this.pressTime = 0;
                this.triggered = false;
            }
        }
    };
    TriggerButton.prototype.checkPressable = function () {
        return this.regButton.inputEnabled;
    };
    TriggerButton.prototype.update = function (deltaTime) {
        // trigger
        if (this.pressed) {
            this.pressTime += deltaTime;
            if (this.pressTime >= this.TRIGGER_TIME) {
                this.pressTime = 0;
                this.onTrigger.dispatch(this.btReturnID);
                this.triggered = true;
            }
        }
    };
    TriggerButton.prototype.OnBtDown = function () {
        if (!this.pressed) {
            this.pressed = true;
            this.pressTime = 0;
        }
        this.triggered = false;
    };
    TriggerButton.prototype.OnBtUp = function () {
        if (this.pressed) {
            this.pressed = false;
            this.pressTime = 0;
        }
        if (!this.triggered) {
            this.onTrigger.dispatch(this.btReturnID);
        }
        this.triggered = false;
    };
    return TriggerButton;
}());

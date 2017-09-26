// CAUTION, use this trigger no need to register Phaser.Button's default button callback
//   otherwise it will call the callback when the button final Up in trigger mode
var TGR_BT_STATE;
(function (TGR_BT_STATE) {
    TGR_BT_STATE[TGR_BT_STATE["NONE"] = 0] = "NONE";
    TGR_BT_STATE[TGR_BT_STATE["START_DELAY"] = 1] = "START_DELAY";
    TGR_BT_STATE[TGR_BT_STATE["SPEED_UP"] = 2] = "SPEED_UP";
    TGR_BT_STATE[TGR_BT_STATE["SPEED_END"] = 3] = "SPEED_END";
})(TGR_BT_STATE || (TGR_BT_STATE = {}));
var TriggerButton = (function () {
    function TriggerButton(inLevel, inButton, inBtReturnID) {
        inLevel.onUpdate.add(this.update, this);
        this.regButton = inButton;
        this.btReturnID = inBtReturnID;
        this.regButton.onInputDown.add(this.OnBtDown, this);
        this.regButton.onInputUp.add(this.OnBtUp, this);
        this.onTrigger = new Phaser.Signal();
        this.enabled = true;
        this.resetState();
    }
    TriggerButton.prototype.setEnabled = function (inEnabled) {
        if (this.enabled == inEnabled)
            return;
        this.enabled = inEnabled;
        if (this.enabled) {
            this.regButton.inputEnabled = true;
            this.regButton.setFrames(0, 0, 1, 0);
        }
        else {
            this.regButton.inputEnabled = false;
            this.regButton.setFrames(2, 2, 2, 2);
            if (this.state != TGR_BT_STATE.NONE) {
                this.resetState();
            }
        }
    };
    TriggerButton.prototype.checkPressable = function () {
        return this.regButton.inputEnabled;
    };
    TriggerButton.prototype.update = function (deltaTime) {
        if (this.state == TGR_BT_STATE.NONE) {
            return;
        }
        else {
            this.stateDeltaTime += deltaTime;
            this.triggerDeltaTime += deltaTime;
        }
        switch (this.state) {
            case TGR_BT_STATE.START_DELAY:
                if (this.stateDeltaTime >= 0.8) {
                    this.stateDeltaTime = 0;
                    this.triggerTime = 0; // first trigger
                    this.state = TGR_BT_STATE.SPEED_UP;
                }
                break;
            case TGR_BT_STATE.SPEED_UP:
                var STATE_DUR = 2.5;
                var START_TGR_TIME = 0.6;
                var END_TGR_TIME = 0.04;
                var rate = (END_TGR_TIME - START_TGR_TIME) / (STATE_DUR - 0.0);
                this.triggerTime = START_TGR_TIME + (rate * this.stateDeltaTime);
                if (this.stateDeltaTime >= STATE_DUR) {
                    this.stateDeltaTime = 0;
                    this.triggerTime = END_TGR_TIME;
                    this.state = TGR_BT_STATE.SPEED_END;
                }
                break;
            case TGR_BT_STATE.SPEED_END:
                break;
        }
        if (this.triggerDeltaTime >= this.triggerTime) {
            this.triggerDeltaTime = 0;
            this.onTrigger.dispatch(this.btReturnID);
        }
    };
    TriggerButton.prototype.OnBtDown = function () {
        if (this.state == TGR_BT_STATE.NONE) {
            this.resetState();
            this.state = TGR_BT_STATE.START_DELAY;
        }
        this.onTrigger.dispatch(this.btReturnID);
    };
    TriggerButton.prototype.OnBtUp = function () {
        if (this.state != TGR_BT_STATE.NONE) {
            this.resetState();
        }
    };
    TriggerButton.prototype.resetState = function () {
        this.state = TGR_BT_STATE.NONE;
        this.stateDeltaTime = 0;
        this.triggerTime = 99999;
        this.triggerDeltaTime = 0;
    };
    return TriggerButton;
}());

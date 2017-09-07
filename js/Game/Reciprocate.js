var Reciprocate = (function () {
    function Reciprocate(inLevel) {
        this.level = inLevel;
        this.pos = 3;
        this.payRightSpriteFrameLight = new Array(3);
        this.payRightSpriteLight = new Array(3);
        this.payRight = new Array(3);
        this.payLeftSpriteFrameLight = new Array(3);
        this.payLeftSpriteLight = new Array(3);
        this.payLeft = new Array(3);
        this.payRightSpriteFrameLight[0] = this.level.fPayFrameLightRight0;
        this.payRightSpriteFrameLight[1] = this.level.fPayFrameLightRight1;
        this.payRightSpriteFrameLight[2] = this.level.fPayFrameLightRight2;
        this.payLeftSpriteFrameLight[0] = this.level.fPayFrameLightLeft0;
        this.payLeftSpriteFrameLight[1] = this.level.fPayFrameLightLeft1;
        this.payLeftSpriteFrameLight[2] = this.level.fPayFrameLightLeft2;
        this.payRightSpriteLight[0] = this.level.fPay010x_1Right0;
        this.payRightSpriteLight[1] = this.level.fPay015x_1Right1;
        this.payRightSpriteLight[2] = this.level.fPay020x_1Right2;
        this.payLeftSpriteLight[0] = this.level.fPay020x_1Left0;
        this.payLeftSpriteLight[1] = this.level.fPay030x_1Left1;
        this.payLeftSpriteLight[2] = this.level.fPay040x_1Left2;
        this.payRight[0] = 10;
        this.payRight[1] = 15;
        this.payRight[2] = 20;
        this.payLeft[0] = 20;
        this.payLeft[1] = 30;
        this.payLeft[2] = 40;
        this.stepNext();
    }
    Reciprocate.prototype.stepNext = function () {
        this.offAll();
        this.pos++;
        if (this.pos >= 4) {
            this.pos = 0;
        }
        this.showWin(true);
    };
    Reciprocate.prototype.getPayRight = function () {
        // 0(right), 1(middle), 2(left), 3(middle), ->loop to 0
        if (this.pos == 0) {
            return this.payRight[0];
        }
        else if (this.pos == 1 || this.pos == 3) {
            return this.payRight[1];
        }
        else {
            return this.payRight[2];
        }
    };
    Reciprocate.prototype.getPayLeft = function () {
        // 0(right), 1(middle), 2(left), 3(middle), ->loop to 0
        if (this.pos == 0) {
            return this.payLeft[0];
        }
        else if (this.pos == 1 || this.pos == 3) {
            return this.payLeft[1];
        }
        else {
            return this.payLeft[2];
        }
    };
    Reciprocate.prototype.setDoubleRight = function () {
        this.offAll();
        for (var i = 0; i < 3; i++) {
            this.payRightSpriteFrameLight[i].visible = true;
            this.payRightSpriteLight[i].visible = true;
        }
    };
    Reciprocate.prototype.setDoubleLeft = function () {
        this.offAll();
        for (var i = 0; i < 3; i++) {
            this.payLeftSpriteFrameLight[i].visible = true;
            this.payLeftSpriteLight[i].visible = true;
        }
    };
    Reciprocate.prototype.showWin = function (onOff) {
        this.offAll();
        if (onOff) {
            // 0(right), 1(middle), 2(left), 3(middle), ->loop to 0
            var onID = void 0;
            if (this.pos == 0) {
                onID = 0;
            }
            else if (this.pos == 1 || this.pos == 3) {
                onID = 1;
            }
            else {
                onID = 2;
            }
            this.payRightSpriteFrameLight[onID].visible = true;
            this.payRightSpriteLight[onID].visible = true;
            this.payLeftSpriteFrameLight[onID].visible = true;
            this.payLeftSpriteLight[onID].visible = true;
        }
    };
    Reciprocate.prototype.offAll = function () {
        for (var i = 0; i < 3; i++) {
            this.payRightSpriteFrameLight[i].visible = false;
            this.payRightSpriteLight[i].visible = false;
            this.payLeftSpriteFrameLight[i].visible = false;
            this.payLeftSpriteLight[i].visible = false;
        }
    };
    return Reciprocate;
}());

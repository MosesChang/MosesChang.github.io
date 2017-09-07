var GameAnm = (function () {
    function GameAnm(inLevel) {
        this.level = inLevel;
        this.spriteIdle = new Array(4);
    }
    GameAnm.prototype.create = function () {
        this.spriteIdle[0] = this.level.fCenterSignIdle1;
        this.spriteIdle[1] = this.level.fCenterSignIdle2;
        this.spriteIdle[2] = this.level.fCenterSignIdle3;
        this.spriteIdle[3] = this.level.fCenterSignIdle4;
        this.level.fWinBoltLeft.blendMode = PIXI.blendModes.ADD;
        this.level.fWinBoltRight.blendMode = PIXI.blendModes.ADD;
        this.level.fCenterSignIdle1_play.onComplete.add(this.callbackAnmIdleEnd1, this);
        this.level.fCenterSignIdle2_play.onComplete.add(this.callbackAnmIdleEnd2, this);
        this.level.fCenterSignIdle3_play.onComplete.add(this.callbackAnmIdleEnd3, this);
        this.level.fCenterSignWin1_play.onComplete.add(this.callbackAnmWinEnd1, this);
        this.level.fCenterSignWin2_play.onComplete.add(this.callbackAnmWinEnd2, this);
        this.visibleIdleByPage(0);
        this.level.fCenterSignWin1.visible = false;
        this.level.fCenterSignWin2.visible = false;
        this.level.fWinBoltLeft.visible = false;
        this.level.fWinBoltRight.visible = false;
    };
    GameAnm.prototype.callbackAnmIdleEnd1 = function () {
        this.visibleIdleByPage(1);
        this.spriteIdle[1].animations.play("play");
    };
    GameAnm.prototype.callbackAnmIdleEnd2 = function () {
        this.visibleIdleByPage(2);
        this.spriteIdle[2].animations.play("play");
    };
    GameAnm.prototype.callbackAnmIdleEnd3 = function () {
        this.visibleIdleByPage(3);
        this.spriteIdle[3].animations.play("play");
    };
    GameAnm.prototype.callbackAnmWinEnd1 = function () {
        this.level.fCenterSignWin1.animations.stop("play");
        this.level.fCenterSignWin1.visible = false;
        this.level.fCenterSignWin2.visible = true;
        this.level.fCenterSignWin2.animations.play("play");
    };
    GameAnm.prototype.callbackAnmWinEnd2 = function () {
        this.level.fCenterSignWin2.animations.stop("play");
        this.level.fCenterSignWin2.visible = false;
        this.level.fCenterSignWin1.visible = true;
        this.level.fCenterSignWin1.animations.play("play");
    };
    GameAnm.prototype.playIdle = function () {
        this.visibleIdleByPage(0);
        this.spriteIdle[0].animations.play("play");
    };
    GameAnm.prototype.visibleIdleByPage = function (page) {
        for (var i = 0; i < 4; i++) {
            if (page == i)
                this.spriteIdle[i].visible = true;
            else
                this.spriteIdle[i].visible = false;
        }
    };
    GameAnm.prototype.playWin = function () {
        this.level.fCenterSignWin2.animations.stop("play");
        this.level.fCenterSignWin2.visible = false;
        this.level.fCenterSignWin1.visible = true;
        this.level.fCenterSignWin1.animations.play("play");
        this.level.fWinBoltLeft.visible = true;
        this.level.fWinBoltLeft.animations.play("play", 30, true);
        this.level.fWinBoltRight.visible = true;
        this.level.fWinBoltRight.animations.play("play", 30, true);
    };
    GameAnm.prototype.stopWin = function () {
        this.level.fCenterSignWin1.animations.stop("play");
        this.level.fCenterSignWin2.animations.stop("play");
        this.level.fCenterSignWin1.visible = false;
        this.level.fCenterSignWin2.visible = false;
        this.level.fWinBoltLeft.animations.stop("play");
        this.level.fWinBoltLeft.visible = false;
        this.level.fWinBoltRight.animations.stop("play");
        this.level.fWinBoltRight.visible = false;
    };
    return GameAnm;
}());

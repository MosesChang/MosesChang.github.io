var GameDouble = (function () {
    function GameDouble(inLevel) {
        this.level = inLevel;
        this.level.onUpdate.add(this.update, this);
        this.isDoubling = false;
        this.lastRandNum = -1;
        this.deltaTimeMinStep = 1.0 / 60.0;
        this.deltaTimeMaxStep = 0.3;
        this.deltaTimeStepAcc = 0.01;
    }
    GameDouble.prototype.setSceneGame = function (inSceneGame, inGameNumber) {
        this.sceneGame = inSceneGame;
        this.gameNumber = inGameNumber;
    };
    GameDouble.prototype.clearDouble = function () {
        this.lastRandNum = 0;
        this.gameNumber.double.text = this.lastRandNum.toString();
        this.gameNumber.double.anchor.set(1);
    };
    GameDouble.prototype.setDouble = function (inDistNum) {
        this.distNum = inDistNum;
        this.isDoubling = true;
        this.deltaTimeNowStep = this.deltaTimeMinStep;
        this.deltaAddTime = 0.0;
        // ------------ moses test ---------------
        //console.log("DoubleDist:"+this.distNum) ;
    };
    GameDouble.prototype.update = function (deltaTime) {
        if (!this.isDoubling)
            return;
        this.deltaAddTime += deltaTime;
        if (this.deltaAddTime >= this.deltaTimeNowStep) {
            this.level.game.sound.play("BS_DoubleRun");
            this.deltaAddTime = 0.0;
            this.deltaTimeNowStep += this.deltaTimeStepAcc;
            if (this.deltaTimeNowStep >= this.deltaTimeMaxStep) {
                this.lastRandNum = this.distNum;
                this.gameNumber.double.text = this.distNum.toString();
                this.sceneGame.doubleDone();
                this.isDoubling = false;
            }
            else {
                this.setDoubleNumberRand();
            }
        }
    };
    GameDouble.prototype.setDoubleNumberRand = function () {
        var numTemp = gameData.getDoubleRand(this.level.game, true, this.lastRandNum);
        this.lastRandNum = numTemp;
        this.gameNumber.double.text = this.lastRandNum.toString();
        this.gameNumber.double.anchor.set(1);
    };
    return GameDouble;
}());

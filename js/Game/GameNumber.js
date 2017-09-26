var GameNumber = (function () {
    function GameNumber(inLevel) {
        this.level = inLevel;
        this.level.onUpdate.add(this.update, this);
        gameData.onStateChange.add(this.stateChange, this);
        this.gameState = GAMESTATE.INIT;
        this.takeWinDeltaTime = 0;
        this.takeWinDistWin = 0;
        this.takeWinAlreadyTake = 0;
        this.TAKE_WIN_MAX_TIME = 1;
        this.TAKE_WIN_MIN_TIME = 0.1;
        this.TAKE_WIN_MAX_TIME_CREDIT = 30;
        this.TAKE_WIN_MIN_TIME_CREDIT = 3;
    }
    GameNumber.prototype.setSceneGame = function (inSceneGame) {
        this.sceneGame = inSceneGame;
    };
    GameNumber.prototype.create = function () {
        this.credit = this.level.game.add.bitmapText(489, 152, 'Number02');
        this.credit.anchor.set(1);
        this.credit.text = "0";
        this.level.fGroupNumber.add(this.credit);
        this.win = this.level.game.add.bitmapText(249, 152, 'Number02');
        this.win.anchor.set(1);
        this.win.text = "0";
        this.level.fGroupNumber.add(this.win);
        this.double = this.level.game.add.bitmapText(296, 557, 'Number02');
        this.double.anchor.set(1);
        this.double.text = "0";
        this.level.fGroupNumber.add(this.double);
        this.rate = this.level.game.add.bitmapText(492, 104, 'Number05');
        this.rate.anchor.set(1);
        this.rate.text = "0";
        this.level.fGroupNumber.add(this.rate);
        this.totalBet = this.level.game.add.bitmapText(251, 102, 'Number06');
        this.totalBet.anchor.set(1);
        this.totalBet.text = "0";
        this.level.fGroupNumber.add(this.totalBet);
        this.bet = new Array(gameData.symbolNum);
        for (var i = 0; i < gameData.symbolNum; i++) {
            this.bet[i] = this.level.game.add.bitmapText(51 + (i * 63), 819, 'Number03');
            this.bet[i].anchor.set(0.5);
            this.bet[i].visible = true;
            this.bet[i].text = "0";
            this.level.fGroupNumber.add(this.bet[i]);
        }
        this.symbolNoHitCount = new Array(gameData.symbolNum);
        this.symbolNoHitCount[0] = this.level.game.add.bitmapText(49, 710, 'Number04');
        this.symbolNoHitCount[1] = this.level.game.add.bitmapText(92, 710, 'Number04');
        this.symbolNoHitCount[2] = this.level.game.add.bitmapText(136, 710, 'Number04');
        this.symbolNoHitCount[3] = this.level.game.add.bitmapText(179, 710, 'Number04');
        this.symbolNoHitCount[4] = this.level.game.add.bitmapText(38, 740, 'Number04');
        this.symbolNoHitCount[5] = this.level.game.add.bitmapText(83, 740, 'Number04');
        this.symbolNoHitCount[6] = this.level.game.add.bitmapText(129, 740, 'Number04');
        this.symbolNoHitCount[7] = this.level.game.add.bitmapText(174, 740, 'Number04');
        for (var i = 0; i < gameData.symbolNum; i++) {
            this.symbolNoHitCount[i].anchor.set(0.5);
            this.symbolNoHitCount[i].visible = true;
            this.symbolNoHitCount[i].text = "0";
            this.level.fGroupNumber.add(this.symbolNoHitCount[i]);
        }
    };
    GameNumber.prototype.update = function (deltaTime) {
        if (this.gameState == GAMESTATE.TAKE_WIN) {
            this.takeWinDeltaTime += deltaTime;
            if (this.takeWinDeltaTime >= this.takeWinTime) {
                this.sceneGame.winTakeStep(-1); // -1 is ending
                if (this.takeWinSound) {
                    this.takeWinSound.stop;
                }
                return;
            }
            var shouldTake = ((this.takeWinDeltaTime / this.takeWinTime) *
                this.takeWinDistWin) | 0;
            if (this.takeWinAlreadyTake < shouldTake) {
                this.sceneGame.winTakeStep(shouldTake - this.takeWinAlreadyTake);
                this.takeWinAlreadyTake = shouldTake;
            }
        }
    };
    GameNumber.prototype.stateChange = function (inPreState, inNowState, para1, para2) {
        if (inNowState < GAMESTATE.TRIGGER_START) {
            this.gameState = inNowState;
        }
        if (inNowState == GAMESTATE.IDLE) {
            if (this.takeWinSound) {
                if (this.takeWinSound.isPlaying) {
                    this.takeWinSound.stop();
                }
            }
        }
        else if (inNowState == GAMESTATE.TAKE_WIN) {
            this.takeWinDeltaTime = 0;
            if (para1 == null) {
                console.log("Error para1 in GameNumber::stateChange()-GAMESTATE.TAKE_WIN-1");
                return;
            }
            if (para1.constructor !== Number) {
                console.log("Error para1 in GameNumber::stateChange()-GAMESTATE.TAKE_WIN-2");
                return;
            }
            this.takeWinDistWin = para1 | 0; // float to int
            this.takeWinDeltaTime = 0;
            this.takeWinAlreadyTake = 0;
            this.takeWinSound = this.level.game.sound.play("CS_Scoring", 1, true);
            if (this.takeWinDistWin <= this.TAKE_WIN_MIN_TIME_CREDIT) {
                this.takeWinTime = this.TAKE_WIN_MIN_TIME;
            }
            else if (this.takeWinDistWin <= this.TAKE_WIN_MAX_TIME_CREDIT) {
                this.takeWinTime = (((this.TAKE_WIN_MAX_TIME - this.TAKE_WIN_MIN_TIME) /
                    (this.TAKE_WIN_MAX_TIME_CREDIT - this.TAKE_WIN_MIN_TIME_CREDIT)) *
                    (this.takeWinDistWin - this.TAKE_WIN_MIN_TIME_CREDIT)) + this.TAKE_WIN_MIN_TIME;
            }
            else {
                this.takeWinTime = this.TAKE_WIN_MAX_TIME;
            }
            /*
            //  ------------ moses test ------------
            console.log( this.takeWinDistWin.toString() +
                    ": " + this.takeWinTime.toString() ) ;
            */
        }
    };
    GameNumber.prototype.setAllByGameData = function () {
        this.credit.text = gameData.credits.toString();
        this.rate.text = gameData.rate.toString();
        for (var i = 0; i < gameData.symbolNum; i++) {
            this.bet[i].visible = true;
            this.bet[i].text = gameData.symbolBet[i].toString();
            this.symbolNoHitCount[i].text = gameData.symbolNoHitCount[i].toString();
        }
        this.totalBet.text = gameData.totalBet.toString();
        this.win.text = gameData.win.toString();
    };
    GameNumber.prototype.setWin = function () {
        this.win.text = gameData.win.toString();
    };
    GameNumber.prototype.clearBitAtWin = function (winSymbolID) {
        for (var i = 0; i < gameData.symbolNum; i++) {
            if (winSymbolID == i) {
                this.bet[i].visible = true;
                this.bet[i].text = gameData.symbolBet[i].toString();
            }
            else {
                this.bet[i].visible = false;
            }
        }
    };
    GameNumber.prototype.clearBitAtJackpot = function (aWinSymbolID) {
        for (var i = 0; i < gameData.symbolNum; i++) {
            var found = false;
            for (var j = 0; j < aWinSymbolID.length; j++) {
                if (aWinSymbolID[j] == i) {
                    found = true;
                    break;
                }
            }
            if (found) {
                this.bet[i].visible = true;
                this.bet[i].text = gameData.symbolBet[i].toString();
            }
            else {
                this.bet[i].visible = false;
            }
        }
    };
    return GameNumber;
}());

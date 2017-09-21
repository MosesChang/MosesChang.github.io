var SceneGame = (function () {
    function SceneGame(inLevel, inputGameNumber, inGameRoller, inGameAnm, inGameHistory, inGameBt, inGameDouble) {
        this.level = inLevel;
        gameData.onStateChange.add(this.stateChange, this);
        this.gameNumber = inputGameNumber;
        this.gameAnm = inGameAnm;
        this.gameHistory = inGameHistory;
        this.gameBt = inGameBt;
        this.gameRoller = inGameRoller;
        this.gameDouble = inGameDouble;
    }
    SceneGame.prototype.create = function () {
        this.gameNumber.setAllByGameData();
        this.gameAnm.playIdle(); // First play wthe start
        gameData.changeState(GAMESTATE.IDLE);
    };
    SceneGame.prototype.stateChange = function (inPreState, inNowState, para1, para2) {
        if (inNowState < GAMESTATE.TRIGGER_START) {
            this.gameState = inNowState;
        }
    };
    SceneGame.prototype.backupBet = function () {
        for (var i = 0; i < gameData.symbolNum; i++) {
            gameData.symbolPerBet[i] = gameData.symbolBet[i];
        }
    };
    SceneGame.prototype.jackpotHit = function (hitSymbolID, pay) {
        // Error Chaek
        if (hitSymbolID < 0 || hitSymbolID >= gameData.symbolNum) {
            console.log("Error input in SceneGame::jackpotHit()");
            gameData.changeState(GAMESTATE.IDLE);
            return;
        }
        // hit
        gameData.win += gameData.symbolBet[hitSymbolID] * pay;
        //if( pay>=30 ){ // Temp
        //    this.gameAnm.playWin() ;
        //}
        //this.winAudio = this.level.game.sound.play("BS_WinBG0"+
        //        (this.level.game.rnd.integerInRange(1, 8)).toString()) ;
        this.gameNumber.setAllByGameData();
        this.gameNumber.clearBitAtWin(hitSymbolID);
    };
    SceneGame.prototype.rollerDone = function (hitSymbolID, luckyTime, pay, bigWinAnm) {
        // Error Chaek
        if (luckyTime == 0 && (hitSymbolID < 0 || hitSymbolID >= gameData.symbolNum)) {
            console.log("Error input in SceneGame::rollerDone()");
            gameData.changeState(GAMESTATE.IDLE);
            return;
        }
        // Init
        this.gameDouble.clearDouble();
        // Lucky time
        if (luckyTime != 0) {
            gameData.changeState(GAMESTATE.JP_GLITTER);
        }
        else if (gameData.symbolBet[hitSymbolID] == 0) {
            this.gameHistory.addSymbol(hitSymbolID);
            this.clearBet();
            gameData.changeState(GAMESTATE.IDLE);
        }
        else {
            this.gameHistory.addSymbol(hitSymbolID);
            gameData.win = gameData.symbolBet[hitSymbolID] * pay;
            var jackpotTemp = false;
            if (gameData.testerJackpot) {
                jackpotTemp = true;
            }
            else if (this.level.game.rnd.integerInRange(1, 5) == 1) {
                jackpotTemp = true;
            }
            if (jackpotTemp) {
                this.gameNumber.setAllByGameData();
                gameData.changeState(GAMESTATE.JP_GLITTER);
            }
            else {
                if (pay >= 30) {
                    this.gameAnm.playWin();
                }
                this.winAudio = this.level.game.sound.play("BS_WinBG0" +
                    (this.level.game.rnd.integerInRange(1, 8)).toString());
                this.gameNumber.setAllByGameData();
                this.gameNumber.clearBitAtWin(hitSymbolID);
                gameData.changeState(GAMESTATE.WIN);
            }
        }
    };
    SceneGame.prototype.doubleDone = function () {
        //console.log("doubleDone") ;       // -------- moses test -----------
        if (gameData.checkDoubleWin() == true) {
            this.level.game.sound.play("BS_DoubleWin");
            gameData.win *= 2;
            this.gameNumber.setWin();
            gameData.changeState(GAMESTATE.DOUBLE_WIN);
        }
        else {
            this.level.game.sound.play("BS_DoubleLose");
            gameData.win = 0;
            this.gameNumber.setAllByGameData();
            this.clearBet();
            gameData.changeState(GAMESTATE.IDLE); // Temp to do this, it will be accointing.
        }
    };
    SceneGame.prototype.jackpotGlitterDone = function () {
        // ------ moese test ----------
        /*
        let sTemp:string ;
        for( var i=0 ; i<50 ; i++ ){
            sTemp = "_ " ;
            var aTemp = this.gameRoller.getRandJackpotTest(false, 5) ;
            for( var j=0 ; j<aTemp.length ; j++ ){
                sTemp += aTemp[j].toString() + " " ;
            }
            console.log(sTemp) ;
        }
        */
        var jpHitPosTemp;
        if (this.gameRoller.getNowPosSymbolID() == 99) {
            jpHitPosTemp = this.gameRoller.getRandJackpotPosTest(false, this.gameRoller.getNowPos());
        }
        else {
            jpHitPosTemp = this.gameRoller.getRandJackpotPosTest(true, this.gameRoller.getNowPos());
        }
        if (jpHitPosTemp.length) {
            gameData.changeState(GAMESTATE.JP_ROLL, jpHitPosTemp);
        }
        else {
            gameData.changeState(GAMESTATE.JP_NO_WIN);
        }
    };
    SceneGame.prototype.jackpotRollDone = function (aJackpotRollHitSymbol, bigWinAnm) {
        if (gameData.win == 0) {
            this.clearBet();
            gameData.changeState(GAMESTATE.IDLE);
        }
        else {
            if (bigWinAnm) {
                this.gameAnm.playWin();
            }
            this.winAudio = this.level.game.sound.play("BS_WinBG0" +
                (this.level.game.rnd.integerInRange(1, 8)).toString());
            this.gameNumber.setAllByGameData();
            this.gameNumber.clearBitAtJackpot(aJackpotRollHitSymbol);
            gameData.changeState(GAMESTATE.WIN);
        }
    };
    SceneGame.prototype.winTakeStep = function (inWinStep) {
        if (this.gameState != GAMESTATE.TAKE_WIN) {
            console.log("ERROR inWinStep in SceneGame::winTakeStep()");
            return;
        }
        if (inWinStep == -1) {
            if (gameData.win > 0) {
                gameData.credits += gameData.win;
                gameData.win = 0;
                this.gameNumber.setAllByGameData();
            }
            gameData.changeState(GAMESTATE.IDLE);
            return;
        }
        if (gameData.win > 0) {
            gameData.credits += inWinStep | 0;
            gameData.win -= inWinStep | 0;
            this.gameNumber.setAllByGameData();
        }
    };
    SceneGame.prototype.OnBtStart = function () {
        console.log("BtStart");
        //this..playNormalBt() ;
        if (this.gameState == GAMESTATE.WIN || this.gameState == GAMESTATE.DOUBLE_WIN) {
            this.winAudio.stop();
            this.gameAnm.stopWin();
            this.clearBet();
            gameData.changeState(GAMESTATE.TAKE_WIN, gameData.win);
            this.gameRoller.showIdle();
        }
        else if (this.gameState == GAMESTATE.TAKE_WIN) {
            if (gameData.win > 0) {
                gameData.credits += gameData.win;
                gameData.win = 0;
                this.gameNumber.setAllByGameData();
            }
            gameData.changeState(GAMESTATE.IDLE);
        }
        else if (this.gameState == GAMESTATE.IDLE) {
            if (gameData.totalBet > 0) {
                if (gameData.testerLuckyTime) {
                    if (this.level.game.rnd.integerInRange(0, 1) == 0) {
                        gameData.rollerStopPos = 5; // ------ moses test ---------
                    }
                    else {
                        gameData.rollerStopPos = 17; // ------ moses test ---------
                    }
                }
                else {
                    gameData.rollerStopPos = this.level.game.rnd.integerInRange(0, this.gameRoller.getSlotNumber() - 1); // temp pos
                }
                this.gameAnm.playIdle();
                gameData.changeState(GAMESTATE.ROLL);
                this.gameRoller.roll(gameData.rollerStopPos);
            }
            else if (this.runPreBet()) {
                if (gameData.testerLuckyTime) {
                    if (this.level.game.rnd.integerInRange(0, 1) == 0) {
                        gameData.rollerStopPos = 5; // ------ moses test ---------
                    }
                    else {
                        gameData.rollerStopPos = 17; // ------ moses test ---------
                    }
                }
                else {
                    gameData.rollerStopPos = this.level.game.rnd.integerInRange(0, this.gameRoller.getSlotNumber() - 1); // temp pos
                }
                this.gameAnm.playIdle();
                gameData.changeState(GAMESTATE.ROLL);
                this.gameRoller.roll(gameData.rollerStopPos);
            }
        }
    };
    SceneGame.prototype.OnBtAllAdd1 = function () {
        console.log("BtAllAdd1");
        gameData.credits -= gameData.symbolNum;
        for (var i = 0; i < gameData.symbolNum; i++) {
            gameData.symbolBet[i]++;
        }
        gameData.totalBet += gameData.symbolNum;
        this.gameBt.setStartBtLockadle(true);
        this.backupBet();
        this.gameNumber.setAllByGameData();
        this.gameRoller.showIdle();
        this.level.game.sound.play("BS_BetBt03");
    };
    SceneGame.prototype.OnBtDoubleL = function () {
        console.log("BtDoubleL");
        this.winAudio.stop();
        this.gameAnm.stopWin();
        gameData.doubleBet = false; // false:Left(1-6)  true:Right(8-13)
        var distTemp = gameData.getDoubleRand(this.level.game, false, 0); // Temp
        //distTemp = 3// ------- moses test ----------
        gameData.doubleDist = distTemp;
        this.gameDouble.setDouble(gameData.doubleDist);
        gameData.changeState(GAMESTATE.DOUBLE, false); // false is left
    };
    SceneGame.prototype.OnBtDoubleR = function () {
        console.log("BtDoubleR");
        this.winAudio.stop();
        this.gameAnm.stopWin();
        gameData.doubleBet = true; // false:Left(1-6)  true:Right(8-13)
        var distTemp = gameData.getDoubleRand(this.level.game, false, 0); // Temp
        //distTemp = 8// ------- moses test ----------
        gameData.doubleDist = distTemp;
        this.gameDouble.setDouble(gameData.doubleDist);
        gameData.changeState(GAMESTATE.DOUBLE, true); // true is right
    };
    SceneGame.prototype.OnBtFunction = function () {
        console.log("BtFunction");
    };
    SceneGame.prototype.OnBtHome = function () {
        console.log("BtHome");
    };
    SceneGame.prototype.OnBtSymbol = function (symID) {
        if (symID < 0 || symID >= gameData.symbolNum) {
            console.log("Error input in SceneGame::OnBtSymbol()");
            return;
        }
        console.log("Symbol " + symID);
        if (this.gameState == GAMESTATE.IDLE && gameData.credits > 0 &&
            gameData.symbolBet[symID] < gameData.symbolBetMax) {
            gameData.credits--;
            gameData.symbolBet[symID]++;
            gameData.totalBet++;
            this.gameBt.setStartBtLockadle(true);
            this.backupBet();
            this.gameNumber.setAllByGameData();
            this.gameRoller.showIdle();
            this.level.game.sound.play("BS_BetBt0" + (symID + 1).toString());
        }
    };
    SceneGame.prototype.clearBet = function () {
        for (var i = 0; i < gameData.symbolNum; i++) {
            gameData.symbolBet[i] = 0;
        }
        gameData.totalBet = 0;
        this.gameNumber.setAllByGameData();
    };
    SceneGame.prototype.runPreBet = function () {
        var totalBetTemp = 0;
        for (var i = 0; i < gameData.symbolNum; i++)
            totalBetTemp += gameData.symbolPerBet[i];
        if (totalBetTemp == 0)
            return false;
        if (totalBetTemp > gameData.credits)
            return false;
        gameData.totalBet = totalBetTemp;
        gameData.credits -= gameData.totalBet;
        for (i = 0; i < gameData.symbolNum; i++) {
            gameData.symbolBet[i] = gameData.symbolPerBet[i];
        }
        this.gameNumber.setAllByGameData();
        return true;
    };
    return SceneGame;
}());

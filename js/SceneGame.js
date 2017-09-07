var SceneGame = (function () {
    function SceneGame(inLevel, inputGameNumber, inGameRoller, inGameAnm, inGameHistory, inGameBt, inGameDouble) {
        this.level = inLevel;
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
        this.gameBt.setStateIdle();
        gameData.gameState = GAMESTATE.IDLE;
    };
    SceneGame.prototype.update = function () {
        //this.level.fGameBackground.position.x += 1 ;
        var deltaTime = this.level.game.time.elapsed / 1000;
        this.gameRoller.update(deltaTime);
        this.gameDouble.update(deltaTime);
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
            gameData.gameState = GAMESTATE.IDLE;
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
        this.gameBt.setStateWin();
        this.gameNumber.clearBitAtWin(hitSymbolID);
    };
    SceneGame.prototype.rollerDone = function (hitSymbolID, luckyTime, pay, bigWinAnm) {
        // Error Chaek
        if (luckyTime == 0 && (hitSymbolID < 0 || hitSymbolID >= gameData.symbolNum)) {
            console.log("Error input in SceneGame::rollerDone()");
            gameData.gameState = GAMESTATE.IDLE;
            return;
        }
        // Init
        this.gameDouble.clearDouble();
        // Lucky time
        if (luckyTime != 0) {
            this.gameRoller.setJpGlitter();
            gameData.gameState = GAMESTATE.JP_GLITTER;
        }
        else if (gameData.symbolBet[hitSymbolID] == 0) {
            this.gameHistory.addSymbol(hitSymbolID);
            this.clearBet();
            this.gameBt.setStateIdle();
            gameData.gameState = GAMESTATE.IDLE;
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
                this.gameRoller.setJpGlitter();
                this.gameNumber.setAllByGameData();
                gameData.gameState = GAMESTATE.JP_GLITTER;
            }
            else {
                if (pay >= 30) {
                    this.gameAnm.playWin();
                }
                this.winAudio = this.level.game.sound.play("BS_WinBG0" +
                    (this.level.game.rnd.integerInRange(1, 8)).toString());
                this.gameNumber.setAllByGameData();
                this.gameBt.setStateWin();
                this.gameNumber.clearBitAtWin(hitSymbolID);
                gameData.gameState = GAMESTATE.WIN;
            }
        }
    };
    SceneGame.prototype.doubleDone = function () {
        //console.log("doubleDone") ;       // -------- moses test -----------
        if (gameData.checkDoubleWin() == true) {
            this.level.game.sound.play("BS_DoubleWin");
            gameData.win *= 2;
            this.gameNumber.setWin();
            this.gameBt.setStateWin();
            gameData.gameState = GAMESTATE.DOUBLE_WIN;
        }
        else {
            this.level.game.sound.play("BS_DoubleLose");
            gameData.win = 0;
            this.gameNumber.setAllByGameData();
            this.clearBet();
            this.gameBt.setStateIdle();
            gameData.gameState = GAMESTATE.IDLE; // Temp to do this, it will be accointing.
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
        gameData.gameState = GAMESTATE.JP_ROLL;
        this.gameRoller.setJpRoll(jpHitPosTemp);
    };
    SceneGame.prototype.jackpotRollDone = function (aJackpotRollHitSymbol, bigWinAnm) {
        if (gameData.win == 0) {
            this.clearBet();
            this.gameBt.setStateIdle();
            gameData.gameState = GAMESTATE.IDLE;
        }
        else {
            if (bigWinAnm) {
                this.gameAnm.playWin();
            }
            this.winAudio = this.level.game.sound.play("BS_WinBG0" +
                (this.level.game.rnd.integerInRange(1, 8)).toString());
            this.gameNumber.setAllByGameData();
            this.gameBt.setStateWin();
            this.gameNumber.clearBitAtJackpot(aJackpotRollHitSymbol);
            gameData.gameState = GAMESTATE.WIN;
        }
    };
    SceneGame.prototype.OnBtStart = function () {
        console.log("BtStart");
        //this..playNormalBt() ;
        if (gameData.gameState == GAMESTATE.WIN || gameData.gameState == GAMESTATE.DOUBLE_WIN) {
            this.winAudio.stop();
            this.gameAnm.stopWin();
            gameData.credits += gameData.win;
            gameData.win = 0;
            this.clearBet();
            this.gameBt.setStateIdle(); // Temp
            this.gameRoller.showIdle();
            gameData.gameState = GAMESTATE.IDLE; // Temp to do this, it will be accointing.
        }
        else if (gameData.gameState == GAMESTATE.IDLE) {
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
                this.gameBt.setStateRollOrDouble();
                gameData.gameState = GAMESTATE.ROLL;
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
                this.gameBt.setStateRollOrDouble();
                gameData.gameState = GAMESTATE.ROLL;
                this.gameRoller.roll(gameData.rollerStopPos);
            }
        }
    };
    SceneGame.prototype.OnBtAuto = function () {
        console.log("BtAuto");
    };
    SceneGame.prototype.OnBtDoubleL = function () {
        console.log("BtDoubleL");
        this.winAudio.stop();
        this.gameAnm.stopWin();
        this.gameBt.setStateRollOrDouble();
        this.gameRoller.setDoubleLeft();
        gameData.doubleBet = false; // false:Left(1-6)  true:Right(8-13)
        var distTemp = gameData.getDoubleRand(this.level.game, false, 0); // Temp
        //distTemp = 3// ------- moses test ----------
        gameData.doubleDist = distTemp;
        this.gameDouble.setDouble(gameData.doubleDist);
        gameData.gameState = GAMESTATE.DOUBLE;
    };
    SceneGame.prototype.OnBtDoubleR = function () {
        console.log("BtDoubleR");
        this.winAudio.stop();
        this.gameAnm.stopWin();
        this.gameBt.setStateRollOrDouble();
        this.gameRoller.setDoubleRight();
        gameData.doubleBet = true; // false:Left(1-6)  true:Right(8-13)
        var distTemp = gameData.getDoubleRand(this.level.game, false, 0); // Temp
        //distTemp = 8// ------- moses test ----------
        gameData.doubleDist = distTemp;
        this.gameDouble.setDouble(gameData.doubleDist);
        gameData.gameState = GAMESTATE.DOUBLE;
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
        if (gameData.gameState == GAMESTATE.IDLE && gameData.credits > 0 &&
            gameData.symbolBet[symID] < gameData.symbolBetMax) {
            gameData.credits--;
            gameData.symbolBet[symID]++;
            gameData.totalBet++;
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

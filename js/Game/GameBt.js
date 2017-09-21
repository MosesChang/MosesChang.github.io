var GameBt = (function () {
    function GameBt(inLevel) {
        this.level = inLevel;
        this.level.onUpdate.add(this.update, this);
        gameData.onStateChange.add(this.stateChange, this);
        this.aSymbolTgrBt = new Array(gameData.symbolNum);
        this.autoPlayTriggerDeltaTime = 0;
    }
    GameBt.prototype.create = function (inSceneGame) {
        this.sceneGame = inSceneGame;
        this.startLockBt = new LockButton(this.level, this.level.fStartBt);
        this.startLockBt.lockable = false;
        this.allAdd1TgrBt = new TriggerButton(this.level, this.level.fAllAdd1Bt, 0);
        this.allAdd1TgrBt.onTrigger.add(this.AllAdd1TriggerRec, this);
        this.aSymbolTgrBt[0] = new TriggerButton(this.level, this.level.fSymbol01Bt, 0);
        this.aSymbolTgrBt[1] = new TriggerButton(this.level, this.level.fSymbol02Bt, 1);
        this.aSymbolTgrBt[2] = new TriggerButton(this.level, this.level.fSymbol03Bt, 2);
        this.aSymbolTgrBt[3] = new TriggerButton(this.level, this.level.fSymbol04Bt, 3);
        this.aSymbolTgrBt[4] = new TriggerButton(this.level, this.level.fSymbol05Bt, 4);
        this.aSymbolTgrBt[5] = new TriggerButton(this.level, this.level.fSymbol06Bt, 5);
        this.aSymbolTgrBt[6] = new TriggerButton(this.level, this.level.fSymbol07Bt, 6);
        this.aSymbolTgrBt[7] = new TriggerButton(this.level, this.level.fSymbol08Bt, 7);
        for (var i = 0; i < gameData.symbolNum; i++) {
            this.aSymbolTgrBt[i].onTrigger.add(this.symbolTriggerRec, this);
        }
    };
    GameBt.prototype.update = function (deltaTime) {
        if (!this.startLockBt.lockable || !this.startLockBt.isLock)
            return;
        if (this.gameState == GAMESTATE.INIT ||
            this.gameState == GAMESTATE.ROLL ||
            this.gameState == GAMESTATE.DOUBLE ||
            this.gameState == GAMESTATE.JP_GLITTER ||
            this.gameState == GAMESTATE.JP_ROLL ||
            this.gameState == GAMESTATE.HELP ||
            !this.startLockBt.shouldEnabled) {
            return;
        }
        this.autoPlayTriggerDeltaTime += deltaTime;
        var timeToGo;
        switch (this.gameState) {
            case GAMESTATE.IDLE:
                timeToGo = 2.0;
                break;
            case GAMESTATE.WIN:
                timeToGo = 3.8;
                break;
            case GAMESTATE.TAKE_WIN:
                timeToGo = 1.1;
                break;
            case GAMESTATE.DOUBLE_WIN:
                timeToGo = 3.8;
                break;
            case GAMESTATE.JP_NO_WIN:
                timeToGo = 3.5;
                break;
            default:
                console.log("Error state not enough in GameBt::update()");
                timeToGo = 1;
        }
        if (this.autoPlayTriggerDeltaTime >= timeToGo) {
            this.autoPlayTriggerDeltaTime = 0;
            this.level.game.sound.play("CS_PressBt");
            this.sceneGame.OnBtStart();
        }
    };
    GameBt.prototype.stateChange = function (inPreState, inNowState, para1, para2) {
        if (inNowState < GAMESTATE.TRIGGER_START) {
            this.gameState = inNowState;
        }
        if (inPreState == GAMESTATE.TAKE_WIN && inNowState == GAMESTATE.IDLE) {
            this.autoPlayTriggerDeltaTime = 0.8; // Faster when in Idle after TakeWin
        }
        else {
            this.autoPlayTriggerDeltaTime = 0;
        }
        if (inNowState == GAMESTATE.ROLL || inNowState == GAMESTATE.DOUBLE) {
            for (var i = 0; i < gameData.symbolNum; i++) {
                this.aSymbolTgrBt[i].setEnabled(false);
            }
            this.startLockBt.setEnabled(false);
            this.allAdd1TgrBt.setEnabled(false);
            this.level.fDoubleLBt.inputEnabled = false;
            this.level.fDoubleRBt.inputEnabled = false;
            this.level.fDoubleLBt.setFrames(2, 2, 2, 2);
            this.level.fDoubleRBt.setFrames(2, 2, 2, 2);
        }
        else if (inNowState == GAMESTATE.IDLE || inNowState == GAMESTATE.TAKE_WIN) {
            for (var i = 0; i < gameData.symbolNum; i++) {
                this.aSymbolTgrBt[i].setEnabled(true);
            }
            this.startLockBt.setEnabled(true);
            if (this.checkAllAdd1Able(false))
                this.allAdd1TgrBt.setEnabled(true);
            else
                this.allAdd1TgrBt.setEnabled(false);
            this.level.fDoubleLBt.inputEnabled = false;
            this.level.fDoubleRBt.inputEnabled = false;
            this.level.fDoubleLBt.setFrames(2, 2, 2, 2);
            this.level.fDoubleRBt.setFrames(2, 2, 2, 2);
        }
        else if (inNowState == GAMESTATE.WIN || inNowState == GAMESTATE.DOUBLE_WIN) {
            for (var i = 0; i < gameData.symbolNum; i++) {
                this.aSymbolTgrBt[i].setEnabled(true);
            }
            this.startLockBt.setEnabled(true);
            if (this.checkAllAdd1Able(false))
                this.allAdd1TgrBt.setEnabled(true);
            else
                this.allAdd1TgrBt.setEnabled(false);
            this.level.fDoubleLBt.inputEnabled = true;
            this.level.fDoubleRBt.inputEnabled = true;
            this.level.fDoubleLBt.setFrames(0, 0, 1, 0);
            this.level.fDoubleRBt.setFrames(0, 0, 1, 0);
        }
    };
    GameBt.prototype.getStartBtLock = function () {
        return this.startLockBt.isLock;
    };
    GameBt.prototype.setStartBtLockadle = function (inLockable) {
        this.startLockBt.lockable = inLockable;
    };
    GameBt.prototype.symbolTriggerRec = function (inID) {
        this.level.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(inID); // Start from 0
    };
    GameBt.prototype.AllAdd1TriggerRec = function (inID) {
        this.level.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtAllAdd1();
        if (this.allAdd1TgrBt.checkPressable()) {
            if (!this.checkAllAdd1Able(true)) {
                this.allAdd1TgrBt.setEnabled(false);
            }
        }
    };
    GameBt.prototype.checkAllAdd1Able = function (stateCheck) {
        if (stateCheck) {
            if (this.gameState == GAMESTATE.INIT ||
                this.gameState == GAMESTATE.ROLL ||
                this.gameState == GAMESTATE.DOUBLE ||
                this.gameState == GAMESTATE.JP_GLITTER ||
                this.gameState == GAMESTATE.JP_ROLL ||
                this.gameState == GAMESTATE.HELP) {
                return false;
            }
        }
        for (var i = 0; i < gameData.symbolNum; i++) {
            if (gameData.symbolBet[i] >= gameData.symbolBetMax) {
                return false;
            }
        }
        if (gameData.credits < gameData.symbolNum) {
            return false;
        }
        return true;
    };
    return GameBt;
}());

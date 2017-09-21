var HitPayType = (function () {
    function HitPayType() {
        this.isLuckyTime = false;
        this.luckTimeSide = 0; // 1:Right 2:Left
        this.hitSymbolID = 0; // lucky time will be 99 at this 
        this.payNumber = 0; // lucky time will be 0 at here
    }
    return HitPayType;
}());
var GameRoller = (function () {
    function GameRoller(inLevel) {
        this.level = inLevel;
        this.level.onUpdate.add(this.update, this);
        gameData.onStateChange.add(this.stateChange, this);
        this.gameState = GAMESTATE.INIT;
        this.ROLLER_TOTAL_TIME = 3;
        this.ROLLER_SPEED_MAX = 70;
        this.ROLLER_SPEED_START = 4;
        this.ROLLER_SPEED_ACC = 1.7;
        this.ROLLER_SPEED_END = 3;
        this.ROLLER_SPEED_DEC = 1.4;
        this.ROLLER_SPEED_STOP_THRESHOLD = 15;
        this.ROLLER_TAIL_SPEED = 25;
        this.ROLLER_TAIL_ADD = 10;
        this.WIN_ON_DUR = 0.2;
        this.WIN_OFF_DUR = 0.5;
        this.rollerNowPos = 0;
        this.rollerStopPos = 0;
        this.rollerTotalTime = 0;
        this.rollerStepTime = 0;
        this.rollerSpeed = this.ROLLER_SPEED_START;
        this.rollerStartToDecend = false;
        this.rollerStartDecendSlot = 0;
        this.rollerStopBeforeSymbolNumber = ((this.ROLLER_SPEED_MAX - this.ROLLER_SPEED_END)
            / this.ROLLER_SPEED_DEC + 4) | 0; // +4 is adjust, |0 is convert float to int  
        this.winDeltaTime = 0;
        this.GLITTER_TOTAL_TIME = 1.3;
        this.GLITTER_TIME = 0.05;
        this.glitterTotalDeltaTime = 0.0;
        this.glitterDeltaTime = 0.0;
        this.JACKPOT_ROLL_TIME = 0.05;
        this.JACKPOT_ROLL_HIT_TIME = 1;
        this.jackpotRollDeltaTimeCountDown = this.JACKPOT_ROLL_TIME;
        this.aJackpotRollHitPos = new Array();
        this.aJackpotRollHitPosNowIndex = 0;
        this.JACKPOT_NO_WIN_TIME = 1.3;
        this.jackpotNoWinDeltaTime = 0;
    }
    GameRoller.prototype.setSceneGame = function (inSceneGame) {
        this.sceneGame = inSceneGame;
    };
    GameRoller.prototype.create = function () {
        this.reciprocate = new Reciprocate(this.level);
        this.aSlot = new Array();
        // Add to aSlot start from 286, 160  (+65,+69) 
        this.addASlot("ORANGE", 26, 160, 77, 215, 20); // 20
        this.addASlot("BELL", 91, 160, 110, 215, 21); // 21
        this.addASlot("BAR50", 156, 160, 175, 215, 22); // 22
        this.addASlot("BAR100", 221, 160, 240, 215, 23); // 23
        this.addASlot("APPLE", 286, 160, 305, 215, 0); // 0
        this.addASlot("APPLEx3", 351, 160, 370, 215, 1); // 1
        this.addASlot("MANGO", 416, 160, 403, 215, 2); // 2
        this.addASlot("WATERMELON", 416, 229, 403, 250, 3); // 3       
        this.addASlot("WATERMELONx3", 416, 298, 403, 319, 4); // 4
        this.addASlot("LUCKYRIGHT", 416, 367, 403, 388, 5); // 5
        this.addASlot("APPLE", 416, 436, 403, 457, 6); // 6
        this.addASlot("ORANGEx3", 416, 505, 403, 526, 7); // 7
        this.addASlot("BELLx3", 26, 229, 77, 250, 19); // 19
        this.addASlot("APPLE", 26, 298, 77, 319, 18); // 18
        this.addASlot("LUCKYLEFT", 26, 367, 77, 388, 17); // 17
        this.addASlot("STAR", 26, 436, 77, 457, 16); // 16    
        this.addASlot("STARx3", 26, 505, 77, 526, 15); // 15
        this.addASlot("MANGO", 26, 574, 77, 561, 14); // 14
        this.addASlot("MANGOx3", 91, 574, 110, 561, 13); // 13
        this.addASlot("APPLE", 156, 574, 175, 561, 12); // 12
        this.addASlot("S77", 221, 574, 240, 561, 11); // 11
        this.addASlot("S77x3", 286, 574, 305, 561, 10); // 10
        this.addASlot("BELL", 351, 574, 370, 561, 9); // 9
        this.addASlot("ORANGE", 416, 574, 403, 561, 8); // 8
    };
    GameRoller.prototype.update = function (deltaTime) {
        if (this.gameState == GAMESTATE.ROLL) {
            // Delta time
            this.rollerTotalTime += deltaTime;
            this.rollerStepTime += deltaTime;
            // Step
            if (this.rollerStepTime >= (1.0 / this.rollerSpeed)) {
                var leap;
                // Sound                
                this.level.game.sound.play("BS_BetBt05"); // Temp
                // Speed
                if (this.rollerTotalTime < this.ROLLER_TOTAL_TIME) {
                    if (this.rollerSpeed < this.ROLLER_SPEED_MAX) {
                        this.rollerSpeed += this.ROLLER_SPEED_ACC;
                        //console.log("Speed+ "+this.rollerSpeed) ;// ----------- moses test -----------
                    }
                }
                else {
                    if (this.rollerStartToDecend) {
                        if (this.rollerSpeed > this.ROLLER_SPEED_END) {
                            this.rollerSpeed -= this.ROLLER_SPEED_DEC;
                            //console.log("Speed- "+this.rollerSpeed) ;// ----------- moses test -----------
                        }
                    }
                    else {
                        leap = (this.rollerStepTime / (1.0 / this.rollerSpeed)) | 0;
                        if (leap <= 0)
                            leap = 1;
                        // console.log("SlotNum:"+this.getSlotNumber()+"  StopPos:"+this.rollerStopPos+"  StopBeforeSymbolNumber:"+
                        //          this.rollerStopBeforeSymbolNumber+
                        //          "  Result:"+this.rollerStartDecendSlot) ;// ----------- moses test -----------
                        for (var i = 0; i < leap; i++) {
                            var tempNow = this.rollerNowPos - i;
                            if (tempNow < 0) {
                                tempNow += this.aSlot.length;
                            }
                            if (tempNow == this.rollerStartDecendSlot) {
                                this.rollerStartToDecend = true;
                                break;
                            }
                        }
                    }
                }
                // --------------- moses test -------------------
                //console.log("TestCouunt ",this.test1++) ;
                // ----------------------------------------------
                // step control
                leap = (this.rollerStepTime / (1.0 / this.rollerSpeed)) | 0;
                if (leap <= 0)
                    leap = 1;
                //console.log("Leap "+leap) ;// ----------- moses test -----------
                this.rollerStepTime -= leap * (1.0 / this.rollerSpeed);
                this.rollerNowPos += leap;
                if (this.rollerNowPos >= this.aSlot.length) {
                    this.rollerNowPos -= this.aSlot.length;
                }
                // Show light
                this.allSymbolOff();
                if (this.rollerSpeed >= this.ROLLER_TAIL_SPEED) {
                    var tail = (((this.rollerSpeed - this.ROLLER_TAIL_SPEED) / this.ROLLER_TAIL_ADD) + 1) | 0;
                    for (var i = 0; i < tail; i++) {
                        var posTemp = this.rollerNowPos - i;
                        if (posTemp < 0)
                            posTemp += this.aSlot.length;
                        this.aSlot[posTemp].lightOnOff(true);
                    }
                }
                else {
                    this.aSlot[this.rollerNowPos].lightOnOff(true);
                }
                // reciprocate
                this.reciprocate.stepNext();
                // Stop
                if (this.rollerTotalTime >= this.ROLLER_TOTAL_TIME) {
                    //console.log("rollerSpeed "+this.rollerSpeed+"    rollerNowPos "+this.rollerNowPos) ;     // ------------ moses test --------------
                    if (this.rollerNowPos == this.rollerStopPos && this.rollerStartToDecend &&
                        this.rollerSpeed <= this.ROLLER_SPEED_STOP_THRESHOLD) {
                        this.rollerStopCount();
                        this.rollerNowPos = this.rollerStopPos;
                        this.allSymbolOff();
                        this.aSlot[this.rollerNowPos].lightOnOff(true);
                        this.winDeltaTime = 0;
                        //console.log("Speed "+this.rollerSpeed) ; // ------------- moses test -----------
                        //console.log("Stop: "+this.rollerStopPos) ; // ------------- moses test -----------
                        return;
                    }
                }
            }
        }
        else if (this.gameState == GAMESTATE.WIN) {
            this.winDeltaTime += deltaTime;
            if (this.aSlot[this.rollerNowPos].checkVisible() == true) {
                if (this.winDeltaTime >= this.WIN_ON_DUR) {
                    this.winDeltaTime = 0;
                    this.allSymbolOff();
                    this.reciprocate.showWin(false);
                }
            }
            else if (this.aSlot[this.rollerNowPos].checkVisible() == false) {
                if (this.winDeltaTime >= this.WIN_OFF_DUR) {
                    this.winDeltaTime = 0;
                    this.reciprocate.showWin(true);
                    if (this.aJackpotRollHitPos.length) {
                        for (var i = 0; i < this.aJackpotRollHitPos.length; i++) {
                            this.aSlot[this.aJackpotRollHitPos[i]].lightOnOff(true);
                        }
                    }
                    else {
                        this.aSlot[this.rollerNowPos].lightOnOff(true);
                    }
                }
            }
        }
        else if (this.gameState == GAMESTATE.DOUBLE_WIN) {
            this.winDeltaTime += deltaTime;
            // on -> off
            if (this.aSlot[this.rollerNowPos].checkVisible() == true) {
                if (this.winDeltaTime >= this.WIN_ON_DUR) {
                    this.winDeltaTime = 0;
                    //this.aSlot[this.rollerNowPos].lightOnOff(false) ;
                    this.allSymbolOff();
                    this.reciprocate.offAll();
                }
            }
            else if (this.aSlot[this.rollerNowPos].checkVisible() == false) {
                if (this.winDeltaTime >= this.WIN_OFF_DUR) {
                    this.winDeltaTime = 0;
                    //this.aSlot[this.rollerNowPos].lightOnOff(true) ;
                    if (gameData.doubleBet == true) {
                        this.reciprocate.setDoubleRight();
                    }
                    else {
                        this.reciprocate.setDoubleLeft();
                    }
                    if (this.aJackpotRollHitPos.length) {
                        for (var i = 0; i < this.aJackpotRollHitPos.length; i++) {
                            this.aSlot[this.aJackpotRollHitPos[i]].lightOnOff(true);
                        }
                    }
                    else {
                        this.aSlot[this.rollerNowPos].lightOnOff(true);
                    }
                }
            }
        }
        else if (this.gameState == GAMESTATE.JP_GLITTER) {
            this.glitterTotalDeltaTime += deltaTime;
            this.glitterDeltaTime += deltaTime;
            if (this.glitterTotalDeltaTime >= this.GLITTER_TOTAL_TIME) {
                this.level.fJackpotLamp.frame = 0;
                this.glitterTotalDeltaTime = 0;
                this.jackpotSound.stop();
                this.sceneGame.jackpotGlitterDone();
            }
            else if (this.glitterDeltaTime >= this.GLITTER_TIME) {
                this.glitterDeltaTime = 0;
                if (this.level.fJackpotLamp.frame == 0) {
                    this.level.fJackpotLamp.frame = 1;
                }
                else {
                    this.level.fJackpotLamp.frame = 0;
                }
            }
        }
        else if (this.gameState == GAMESTATE.JP_ROLL) {
            // delta time
            this.jackpotRollDeltaTimeCountDown -= deltaTime;
            if (this.jackpotRollDeltaTimeCountDown > 0) {
                return;
            }
            this.jackpotRollDeltaTimeCountDown = this.JACKPOT_ROLL_TIME;
            // step
            if (this.jackpotRollWay) {
                this.rollerNowPos++;
                if (this.rollerNowPos >= this.aSlot.length) {
                    this.rollerNowPos -= this.aSlot.length;
                }
            }
            else {
                this.rollerNowPos--;
                if (this.rollerNowPos < 0) {
                    this.rollerNowPos += this.aSlot.length;
                }
            }
            // lights on off 
            this.allSymbolOff();
            for (var i = 0; i < this.aJackpotRollHitPosNowIndex; i++) {
                this.aSlot[this.aJackpotRollHitPos[i]].lightOnOff(true);
            }
            this.aSlot[this.rollerNowPos].lightOnOff(true);
            // Hit & next one & Done
            if (this.rollerNowPos == this.aJackpotRollHitPos[this.aJackpotRollHitPosNowIndex]) {
                this.jackpotRollDeltaTimeCountDown = this.JACKPOT_ROLL_HIT_TIME;
                this.level.game.sound.play("BS_BonusWin02");
                var returnHitPay = this.getHitPay(this.rollerNowPos);
                if (returnHitPay.isLuckyTime) {
                    console.log("ERROR returnHitPay in GameRoller::update()");
                }
                else {
                    this.sceneGame.jackpotHit(returnHitPay.hitSymbolID, returnHitPay.payNumber);
                }
                this.jackpotRollWay = !this.jackpotRollWay;
                this.aJackpotRollHitPosNowIndex++;
                if (this.aJackpotRollHitPosNowIndex >= this.aJackpotRollHitPos.length) {
                    this.rollerNowPos = this.rollerStopPos;
                    var aJackpotRollHitSymbol = this.getJackpoyRollHitSymbol();
                    this.sceneGame.jackpotRollDone(aJackpotRollHitSymbol, this.getBigWinAnmPlayable());
                }
            }
            else {
                this.level.game.sound.play("BS_BetBt01"); // Temp
            }
        }
        else if (this.gameState == GAMESTATE.JP_NO_WIN) {
            this.jackpotNoWinDeltaTime += deltaTime;
            if (this.jackpotNoWinDeltaTime >= this.JACKPOT_NO_WIN_TIME) {
                var aJackpotRollHitSymbol = this.getJackpoyRollHitSymbol();
                this.sceneGame.jackpotRollDone(aJackpotRollHitSymbol, this.getBigWinAnmPlayable());
            }
        }
    };
    GameRoller.prototype.stateChange = function (inPreState, inNowState, para1, para2) {
        if (inNowState < GAMESTATE.TRIGGER_START) {
            this.gameState = inNowState;
        }
        if (inNowState == GAMESTATE.JP_GLITTER) {
            this.setJpGlitter();
        }
        else if (inNowState == GAMESTATE.JP_ROLL) {
            if (para1 == null) {
                console.log("Error para1 in GameRoller::stateChange()-GAMESTATE.JP_ROLL-1");
                return;
            }
            if (para1.constructor !== Array) {
                console.log("Error para1 in GameRoller::stateChange()-GAMESTATE.JP_ROLL-2");
                return;
            }
            this.setJpRoll(para1);
        }
        else if (inNowState == GAMESTATE.JP_NO_WIN) {
            this.setJpRollNoWin();
        }
        else if (inNowState == GAMESTATE.DOUBLE) {
            if (para1 == null) {
                console.log("Error para1 in GameRoller::stateChange()-GAMESTATE.DOUBLE-1");
                return;
            }
            if (para1.constructor !== Boolean) {
                console.log("Error para1 in GameRoller::stateChange()-GAMESTATE.DOUBLE-2");
                return;
            }
            if (para1 == true) {
                this.setDoubleRight();
            }
            else {
                this.setDoubleLeft();
            }
        }
    };
    GameRoller.prototype.showIdle = function () {
        this.winDeltaTime = 0;
        this.allSymbolOff();
        if (this.aJackpotRollHitPos.length) {
            for (var i = 0; i < this.aJackpotRollHitPos.length; i++) {
                this.aSlot[this.aJackpotRollHitPos[i]].lightOnOff(true);
            }
        }
        else {
            this.aSlot[this.rollerNowPos].lightOnOff(true);
        }
        this.reciprocate.showWin(true);
    };
    GameRoller.prototype.roll = function (stopPos) {
        this.rollerStopPos = stopPos;
        this.rollerTotalTime = 0;
        this.rollerStepTime = 0;
        this.rollerSpeed = this.ROLLER_SPEED_START;
        this.rollerStartToDecend = false;
        this.aJackpotRollHitPos.length = 0;
        this.aJackpotRollHitPosNowIndex = 0;
        this.rollerStartDecendSlot = this.rollerStopPos - this.rollerStopBeforeSymbolNumber;
        this.rollerStartDecendSlot = this.rollerStartDecendSlot % this.getSlotNumber();
        if (this.rollerStartDecendSlot < 0)
            this.rollerStartDecendSlot += this.getSlotNumber();
    };
    GameRoller.prototype.getSlotNumber = function () {
        return this.aSlot.length;
    };
    GameRoller.prototype.getRandJackpotPosTest = function (hitAtLeastOne, nowPos) {
        var sRand;
        var hitNumber;
        var hitTemp;
        var repeatTemp;
        sRand = new Array();
        if (hitAtLeastOne == true) {
            hitNumber = this.level.game.rnd.integerInRange(1, 3);
        }
        else {
            hitNumber = this.level.game.rnd.integerInRange(0, 3);
        }
        //hitNumber = 3 ;       // ------------ moses test -----------
        for (var ihitNum = 0; ihitNum < hitNumber; ihitNum++) {
            while (1) {
                hitTemp = this.level.game.rnd.integerInRange(0, this.aSlot.length - 1);
                if (this.aSlot[hitTemp].symbol.belong == "SPECIAL")
                    continue;
                if (hitTemp == nowPos)
                    continue;
                repeatTemp = false;
                for (var i = 0; i < sRand.length; i++) {
                    if (sRand[i] == hitTemp) {
                        repeatTemp = true;
                        break;
                    }
                }
                if (repeatTemp == true)
                    continue;
                break;
            }
            sRand.push(hitTemp);
        }
        // -------- moses test ------------
        /*
        sRand.length = 0 ;
        sRand.push(20);
        sRand.push(3);
        sRand.push(11);
        */
        // --------------------------------
        return sRand;
    };
    GameRoller.prototype.getNowPos = function () {
        return this.rollerNowPos;
    };
    GameRoller.prototype.getNowPosSymbolID = function () {
        return this.aSlot[this.rollerNowPos].symbol.symbolID;
    };
    GameRoller.prototype.setJpGlitter = function () {
        this.glitterTotalDeltaTime = 0.0;
        this.glitterDeltaTime = 0.0;
        this.jackpotSound = this.level.game.sound.play("BS_HitJP", 1, true);
    };
    GameRoller.prototype.setJpRoll = function (inJackpotRollHit) {
        if (inJackpotRollHit == null) {
            console.log("Error input in GameRoller::setJpRoll()");
            return;
        }
        this.jackpotRollDeltaTimeCountDown = this.JACKPOT_ROLL_TIME;
        this.aJackpotRollHitPos.length = 0;
        this.jackpotRollWay = false; // true:clockwise    false:counter-clockwise
        this.aJackpotRollHitPos.push(this.rollerNowPos);
        for (var i = 0; i < inJackpotRollHit.length; i++)
            this.aJackpotRollHitPos.push(inJackpotRollHit[i]);
        this.aJackpotRollHitPosNowIndex = 1;
    };
    GameRoller.prototype.setJpRollNoWin = function () {
        this.jackpotNoWinDeltaTime = 0;
        this.level.game.sound.play("BS_BonusNoWin");
    };
    GameRoller.prototype.setDoubleRight = function () {
        this.showIdle();
        this.reciprocate.setDoubleRight();
    };
    GameRoller.prototype.setDoubleLeft = function () {
        this.showIdle();
        this.reciprocate.setDoubleLeft();
    };
    GameRoller.prototype.getBigWinAnmPlayable = function () {
        var threshold = 30; // Temp
        var hitPay;
        if (this.aJackpotRollHitPos.length) {
            for (var i = 0; i < this.aJackpotRollHitPos.length; i++) {
                hitPay = this.getHitPay(this.aJackpotRollHitPos[i]);
                if (hitPay.payNumber >= threshold)
                    return true;
            }
        }
        else {
            hitPay = this.getHitPay(this.rollerNowPos);
            if (hitPay.payNumber >= threshold)
                return true;
        }
        return false;
    };
    GameRoller.prototype.getJackpoyRollHitSymbol = function () {
        var aJackpotRollHitSymbol;
        aJackpotRollHitSymbol = new Array();
        for (var i = 0; i < this.aJackpotRollHitPos.length; i++) {
            if (this.aSlot[this.aJackpotRollHitPos[i]].symbol.symbolID != 99) {
                aJackpotRollHitSymbol.push(this.aSlot[this.aJackpotRollHitPos[i]].symbol.symbolID);
            }
        }
        return aJackpotRollHitSymbol;
    };
    GameRoller.prototype.getHitPay = function (inRollerPos) {
        var nowSymbolElement = this.aSlot[inRollerPos].symbol;
        var returnHitPay;
        // Init
        returnHitPay = new HitPayType();
        // Lucky Time
        if (nowSymbolElement.belong == "SPECIAL") {
            if (nowSymbolElement.name == "LUCKYRIGHT") {
                returnHitPay.isLuckyTime = true;
                returnHitPay.luckTimeSide = 1; // 1:Right 2:Left
                returnHitPay.hitSymbolID = 99;
                returnHitPay.payNumber = 0;
                return returnHitPay;
            }
            else if (nowSymbolElement.name == "LUCKYLEFT") {
                returnHitPay.isLuckyTime = true;
                returnHitPay.luckTimeSide = 2; // 1:Right 2:Left
                returnHitPay.hitSymbolID = 99;
                returnHitPay.payNumber = 0;
                return returnHitPay;
            }
            else {
                console.log("ERROR define in GameRoller::getHitPay()");
                return returnHitPay;
            }
        }
        // Hitx3 or Bar50
        if (nowSymbolElement.belong != "") {
            for (var i = 0; i < gameData.symbolNum; i++) {
                if (FULLSYMBOL[i].name == nowSymbolElement.belong) {
                    returnHitPay.isLuckyTime = false;
                    returnHitPay.luckTimeSide = 0;
                    returnHitPay.hitSymbolID = i;
                    returnHitPay.payNumber = nowSymbolElement.value;
                    return returnHitPay;
                }
            }
            console.log("ERROR belong ID in GameRoller::getHitPay()");
        }
        // Hit const value (Apple or Bar)
        if (nowSymbolElement.value != -1) {
            for (var i = 0; i < gameData.symbolNum; i++) {
                if (FULLSYMBOL[i].name == nowSymbolElement.name) {
                    returnHitPay.isLuckyTime = false;
                    returnHitPay.luckTimeSide = 0;
                    returnHitPay.hitSymbolID = i;
                    returnHitPay.payNumber = nowSymbolElement.value;
                    return returnHitPay;
                }
            }
        }
        else {
            var valueTemp;
            // right
            if (nowSymbolElement.name == "ORANGE" || nowSymbolElement.name == "MANGO" || nowSymbolElement.name == "BELL") {
                valueTemp = this.reciprocate.getPayRight();
            }
            else if (nowSymbolElement.name == "WATERMELON" || nowSymbolElement.name == "STAR" || nowSymbolElement.name == "S77") {
                valueTemp = this.reciprocate.getPayLeft();
            }
            else {
                console.log("ERROR  inner code error-1 in GameRoller::getHitPay()");
            }
            for (var i = 0; i < gameData.symbolNum; i++) {
                if (FULLSYMBOL[i].name == nowSymbolElement.name) {
                    returnHitPay.isLuckyTime = false;
                    returnHitPay.luckTimeSide = 0;
                    returnHitPay.hitSymbolID = i;
                    returnHitPay.payNumber = valueTemp;
                    return returnHitPay;
                }
            }
            console.log("ERROR  inner code error-2 in GameRoller::getHitPay()");
            return returnHitPay;
        }
        console.log("ERROR inner code error-3 in GameRoller::getHitPay()");
        return returnHitPay;
    };
    GameRoller.prototype.rollerStopCount = function () {
        var returnHitPay = this.getHitPay(this.rollerNowPos);
        if (returnHitPay.isLuckyTime) {
            this.sceneGame.rollerDone(99, returnHitPay.luckTimeSide, 0, this.getBigWinAnmPlayable());
        }
        else {
            this.sceneGame.rollerDone(returnHitPay.hitSymbolID, 0, returnHitPay.payNumber, this.getBigWinAnmPlayable());
        }
    };
    GameRoller.prototype.allSymbolOff = function () {
        for (var i = 0; i < this.aSlot.length; i++) {
            this.aSlot[i].lightOnOff(false);
        }
    };
    GameRoller.prototype.addASlot = function (fullSymbolName, symbolX, symbolY, lightX, lightY, arrayIndex) {
        var symEleTemp = this.getSymbolEle(fullSymbolName);
        this.aSlot[arrayIndex] = new RollerSlot(symEleTemp, this.level, symbolX, symbolY, lightX, lightY);
    };
    GameRoller.prototype.getSymbolEle = function (fullSymbolName) {
        for (var i = 0; i < FULLSYMBOL.length; i++) {
            if (fullSymbolName == FULLSYMBOL[i].name) {
                return FULLSYMBOL[i];
            }
        }
        console.log("Error input in GameRoller::getSymbolEle()");
        return null;
    };
    return GameRoller;
}());

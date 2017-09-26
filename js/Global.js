var GAMESTATE;
(function (GAMESTATE) {
    // Normal state, save it
    GAMESTATE[GAMESTATE["INIT"] = 1] = "INIT";
    GAMESTATE[GAMESTATE["IDLE"] = 2] = "IDLE";
    GAMESTATE[GAMESTATE["ROLL"] = 3] = "ROLL";
    GAMESTATE[GAMESTATE["WIN"] = 4] = "WIN";
    GAMESTATE[GAMESTATE["TAKE_WIN"] = 5] = "TAKE_WIN";
    GAMESTATE[GAMESTATE["DOUBLE"] = 6] = "DOUBLE";
    GAMESTATE[GAMESTATE["DOUBLE_WIN"] = 7] = "DOUBLE_WIN";
    GAMESTATE[GAMESTATE["JP_GLITTER"] = 8] = "JP_GLITTER";
    GAMESTATE[GAMESTATE["JP_ROLL"] = 9] = "JP_ROLL";
    GAMESTATE[GAMESTATE["JP_NO_WIN"] = 10] = "JP_NO_WIN";
    GAMESTATE[GAMESTATE["HELP"] = 11] = "HELP";
    // Trigger mark
    GAMESTATE[GAMESTATE["TRIGGER_START"] = 12] = "TRIGGER_START";
    // Trigger state start, no save just trigger only
    //TR_JP_HIT,
})(GAMESTATE || (GAMESTATE = {}));
var SymbolElement = (function () {
    function SymbolElement(inName, inValue, inKeyName, inBelong, inSymbolID) {
        this.name = inName;
        this.value = inValue;
        this.keyName = inKeyName;
        this.belong = inBelong;
        this.symbolID = inSymbolID;
    }
    return SymbolElement;
}());
var FULLSYMBOL = [
    new SymbolElement("BAR100", 100, "BU_Symbol01", "", 0),
    new SymbolElement("S77", -1, "BU_Symbol03", "", 1),
    new SymbolElement("STAR", -1, "BU_Symbol05", "", 2),
    new SymbolElement("WATERMELON", -1, "BU_Symbol07", "", 3),
    new SymbolElement("BELL", -1, "BU_Symbol09", "", 4),
    new SymbolElement("MANGO", -1, "BU_Symbol11", "", 5),
    new SymbolElement("ORANGE", -1, "BU_Symbol13", "", 6),
    new SymbolElement("APPLE", 5, "BU_Symbol15", "", 7),
    new SymbolElement("BAR50", 50, "BU_Symbol02", "BAR100", 0),
    new SymbolElement("S77x3", 3, "BU_Symbol04", "S77", 1),
    new SymbolElement("STARx3", 3, "BU_Symbol06", "STAR", 2),
    new SymbolElement("WATERMELONx3", 3, "BU_Symbol08", "WATERMELON", 3),
    new SymbolElement("BELLx3", 3, "BU_Symbol10", "BELL", 4),
    new SymbolElement("MANGOx3", 3, "BU_Symbol12", "MANGO", 5),
    new SymbolElement("ORANGEx3", 3, "BU_Symbol14", "ORANGE", 6),
    new SymbolElement("APPLEx3", 3, "BU_Symbol16", "APPLE", 7),
    new SymbolElement("LUCKYRIGHT", 0, "BU_Symbol17", "SPECIAL", 99),
    new SymbolElement("LUCKYLEFT", 0, "BU_Symbol18", "SPECIAL", 99)
];
var GameData = (function () {
    function GameData() {
        //  public testerAllBit1: boolean = true ;    
        this.testerAllBit1 = false;
        //    public testerLuckyTime: boolean = true ;
        this.testerLuckyTime = false;
        //    public testerJackpot: boolean = true ;    
        this.testerJackpot = false;
        //    public testerAudioMute: boolean = true ;
        this.testerAudioMute = false;
        this.onStateChange = new Phaser.Signal();
        this.gameState = GAMESTATE.INIT;
        this.preGameState = GAMESTATE.INIT;
        this.credits = 100000;
        this.rate = 20;
        this.totalBet = 0;
        this.rollerStopPos = 0;
        this.symbolBetMax = 99;
        this.win = 0;
        this.doubleDist = 0;
        this.doubleBet = false; // false:Left(1-6)  true:Right(8-13)
        var count = 0;
        for (var i = 0; i < FULLSYMBOL.length; i++) {
            if (FULLSYMBOL[i].belong == "")
                count++;
        }
        this.symbolNum = count;
        this.symbolBet = new Array(this.symbolNum);
        this.symbolPerBet = new Array(this.symbolNum);
        this.symbolNoHitCount = new Array(this.symbolNum);
        for (var i = 0; i < this.symbolNum; i++) {
            this.symbolNoHitCount[i] = 0;
            if (this.testerAllBit1 == true) {
                this.symbolBet[i] = 1;
                this.symbolPerBet[i] = 1;
            }
            else {
                this.symbolBet[i] = 0;
                this.symbolPerBet[i] = 0;
            }
        }
    }
    GameData.prototype.changeState = function (newState, para1, para2) {
        // ------------ moses test ---------------------
        /*
        switch( newState )
        {
            case GAMESTATE.INIT :
                console.log("State:INIT") ;
                break ;
            case GAMESTATE.IDLE :
                console.log("State:IDLE") ;
                break ;
            case GAMESTATE.ROLL :
                console.log("State:ROLL") ;
                break ;
            case GAMESTATE.WIN :
                console.log("State:WIN") ;
                break ;
            case GAMESTATE.TAKE_WIN :
                console.log("State:TAKE_WIN") ;
                break ;
            case GAMESTATE.DOUBLE :
                console.log("State:DOUBLE") ;
                break ;
            case GAMESTATE.DOUBLE_WIN :
                console.log("State:DOUBLE_WIN") ;
                break ;
            case GAMESTATE.JP_GLITTER :
                console.log("State:JP_GLITTER") ;
                break ;
            case GAMESTATE.JP_ROLL :
                console.log("State:JP_ROLL") ;
                break ;
            case GAMESTATE.JP_NO_WIN :
                console.log("State:JP_NO_WIN") ;
                break ;
            case GAMESTATE.HELP :
                console.log("State:HELP") ;
                break ;
        }
        */
        // ---------------------------------------------
        // Normal state, save it
        if (newState < GAMESTATE.TRIGGER_START) {
            this.preGameState = this.gameState;
            this.gameState = newState;
            if (para1 != null && para2 != null) {
                this.onStateChange.dispatch(this.preGameState, this.gameState, para1, para2);
            }
            else if (para1 != null && para2 == null) {
                this.onStateChange.dispatch(this.preGameState, this.gameState, para1);
            }
            else {
                this.onStateChange.dispatch(this.preGameState, this.gameState);
            }
        }
        else {
            if (para1 != null && para2 != null) {
                this.onStateChange.dispatch(this.gameState, newState, para1, para2);
            }
            else if (para1 != null && para2 == null) {
                this.onStateChange.dispatch(this.gameState, newState, para1);
            }
            else {
                this.onStateChange.dispatch(this.gameState, newState);
            }
        }
    };
    GameData.prototype.checkDoubleWin = function () {
        if (this.doubleDist < 1 || this.doubleDist == 7 || this.doubleDist > 13) {
            console.log("Error in GameData::checkDoubleWin() doubleDist error!");
            return false;
        }
        if (this.doubleDist < 7 && this.doubleBet == false) {
            return true;
        }
        else if (this.doubleDist > 7 && this.doubleBet == true) {
            return true;
        }
        return false;
    };
    GameData.prototype.getDoubleRand = function (game, considerPreRand, preRand) {
        var randTemp;
        var LRTemp = game.rnd.integerInRange(0, 1); // 0:Left(1-6)  1:Right(8-13)
        if (LRTemp == 0) {
            randTemp = game.rnd.integerInRange(1, 6);
            if (considerPreRand == false) {
                return randTemp;
            }
            if (randTemp == preRand) {
                randTemp++;
                if (randTemp > 6)
                    randTemp = 1;
            }
        }
        else {
            randTemp = game.rnd.integerInRange(8, 13);
            if (considerPreRand == false) {
                return randTemp;
            }
            if (randTemp == preRand) {
                randTemp++;
                if (randTemp > 13)
                    randTemp = 8;
            }
        }
        return randTemp;
    };
    return GameData;
}());
var gameData = new GameData();

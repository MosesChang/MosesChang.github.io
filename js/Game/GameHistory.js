var GameHistory = (function () {
    function GameHistory(inLevel) {
        this.level = inLevel;
        this.historyMaxNum = 10;
        this.aHistoryID = new Array();
    }
    GameHistory.prototype.addSymbol = function (hitSymbolID) {
        if (this.aHistoryID.length >= this.historyMaxNum) {
            this.aHistoryID.pop();
        }
        this.aHistoryID.unshift(hitSymbolID);
        this.showHistory();
    };
    GameHistory.prototype.showHistory = function () {
        this.level.fGroupHistory.removeAll();
        //this.level.fGroupHistory.add(child, silent, index)
        for (var i = 0; i < this.aHistoryID.length; i++) {
            var numStr = void 0;
            if (this.aHistoryID[i] + 1 >= 10)
                numStr = (this.aHistoryID[i] + 1).toString();
            else
                numStr = "0" + (this.aHistoryID[i] + 1).toString();
            if (i == 0) {
                this.level.fGroupHistory.create(430 - (40 * i), 9, "Result" + numStr + "_1");
            }
            else {
                this.level.fGroupHistory.create(430 - (40 * i), 9, "Result" + numStr + "_2");
            }
        }
        // --------------- moses test ----------------
        /*
        let tempStr:string = "" ;
        for( var i=0 ; i<this.aHistoryID.length ; i++ ){
            tempStr += i.toString() + ":" + this.aHistoryID[i].toString() + "  " ;
        }
        console.log( tempStr ) ;
        console.log( "" ) ;
        */
        // -------------------------------------------
    };
    return GameHistory;
}());

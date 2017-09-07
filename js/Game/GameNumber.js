var GameNumber = (function () {
    function GameNumber(inLevel) {
        this.level = inLevel;
    }
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
        this.rate = this.level.game.add.bitmapText(492, 102, 'Number05');
        this.rate.anchor.set(1);
        this.rate.text = "0";
        this.level.fGroupNumber.add(this.rate);
        this.totalBet = this.level.game.add.bitmapText(251, 102, 'Number06');
        this.totalBet.anchor.set(1);
        this.totalBet.text = "0";
        this.level.fGroupNumber.add(this.totalBet);
        this.bet = new Array(gameData.symbolNum);
        for (var i = 0; i < gameData.symbolNum; i++) {
            this.bet[i] = this.level.game.add.bitmapText(66 + (i * 63), 835, 'Number03');
            this.bet[i].anchor.set(1);
            this.bet[i].visible = true;
            this.bet[i].text = "0";
            this.level.fGroupNumber.add(this.bet[i]);
        }
    };
    GameNumber.prototype.setAllByGameData = function () {
        this.credit.text = gameData.credits.toString();
        this.rate.text = gameData.rate.toString();
        for (var i = 0; i < gameData.symbolNum; i++) {
            this.bet[i].visible = true;
            this.bet[i].text = gameData.symbolBet[i].toString();
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

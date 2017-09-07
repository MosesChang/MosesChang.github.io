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
        this.symbolNoHitCount = new Array(gameData.symbolNum);
        this.symbolNoHitCount[0] = this.level.game.add.bitmapText(49, 710, 'Number04');
        this.symbolNoHitCount[1] = this.level.game.add.bitmapText(92, 710, 'Number04');
        this.symbolNoHitCount[2] = this.level.game.add.bitmapText(136, 710, 'Number04');
        this.symbolNoHitCount[3] = this.level.game.add.bitmapText(179, 710, 'Number04');
        this.symbolNoHitCount[4] = this.level.game.add.bitmapText(38, 738, 'Number04');
        this.symbolNoHitCount[5] = this.level.game.add.bitmapText(83, 738, 'Number04');
        this.symbolNoHitCount[6] = this.level.game.add.bitmapText(129, 738, 'Number04');
        this.symbolNoHitCount[7] = this.level.game.add.bitmapText(174, 738, 'Number04');
        for (var i = 0; i < gameData.symbolNum; i++) {
            this.symbolNoHitCount[i].anchor.set(0.5);
            this.symbolNoHitCount[i].visible = true;
            this.symbolNoHitCount[i].text = "0";
            this.level.fGroupNumber.add(this.symbolNoHitCount[i]);
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

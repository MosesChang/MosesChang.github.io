// -- user code here --
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* --- start generated code --- */
// Generated by Phaser Editor v1.4.1 (Phaser v2.6.2)
/**
 * Level.
 */
var Level = (function (_super) {
    __extends(Level, _super);
    function Level() {
        var _this = _super.call(this) || this;
        _this.afterConstructor();
        return _this;
    }
    Level.prototype.init = function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.stage.backgroundColor = '#ffffff';
        this.afterInit();
    };
    Level.prototype.preload = function () {
        this.load.pack('Game', 'assets/pack.json');
        this.afterPreload();
    };
    ;
    Level.prototype.create = function () {
        var _groupBackground = this.add.group();
        var _GameBackground = this.add.sprite(0, 0, 'GameBackground', null, _groupBackground);
        this.add.sprite(395, 65, 'ValueFrame', null, _groupBackground);
        this.add.sprite(43, 66, 'TotalBetFrame', null, _groupBackground);
        this.add.sprite(281, 94, 'CreditFrame', null, _groupBackground);
        this.add.sprite(41, 94, 'WinFrame', null, _groupBackground);
        var _groupHistory = this.add.group();
        var _groupCenterSign = this.add.group();
        var _centerSignIdle1 = this.add.sprite(106, 243, 'CenterSignIdle1', '001', _groupCenterSign);
        var _centerSignIdle1_play = _centerSignIdle1.animations.add('play', ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027', '028', '029', '030'], 30, false);
        var _centerSignIdle2 = this.add.sprite(106, 243, 'CenterSignIdle2', '032', _groupCenterSign);
        var _centerSignIdle2_play = _centerSignIdle2.animations.add('play', ['031', '032', '033', '034', '035', '036', '037', '038', '039', '040', '041', '042', '043', '044', '045', '046', '047', '048', '049', '050', '051', '052', '053', '054', '055', '056', '057', '058', '059', '060'], 30, false);
        var _centerSignIdle3 = this.add.sprite(106, 243, 'CenterSignIdle3', '061', _groupCenterSign);
        var _centerSignIdle3_play = _centerSignIdle3.animations.add('play', ['061', '062', '063', '064', '065', '066', '067', '068', '069', '070', '071', '072', '073', '074', '075', '076', '077', '078', '079', '080', '081', '082', '083', '084', '085', '086', '087', '088', '089', '090'], 30, false);
        var _centerSignIdle4 = this.add.sprite(106, 243, 'CenterSignIdle4', '091', _groupCenterSign);
        var _centerSignIdle4_play = _centerSignIdle4.animations.add('play', ['091', '092', '093', '094', '095', '096', '097', '098', '099', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120'], 30, false);
        var _centerSignWin1 = this.add.sprite(106, 243, 'CenterSignWin1', '01', _groupCenterSign);
        var _centerSignWin1_play = _centerSignWin1.animations.add('play', ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'], 30, false);
        var _centerSignWin2 = this.add.sprite(106, 243, 'CenterSignWin2', '31', _groupCenterSign);
        var _centerSignWin2_play = _centerSignWin2.animations.add('play', ['31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'], 30, false);
        var _WinBoltLeft = this.add.sprite(0, 60, 'WinBolt', '01', _groupCenterSign);
        _WinBoltLeft.animations.add('play', ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'], 30, false);
        var _WinBoltRight = this.add.sprite(546, 60, 'WinBolt', '01', _groupCenterSign);
        _WinBoltRight.scale.setTo(-1.0, 1.0);
        _WinBoltRight.animations.add('play', ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'], 30, false);
        var _groupBt = this.add.group();
        var _StartBt = this.add.button(405, 665, 'StartBt', this.OnBtStart, this, 0, 0, 1, 0, _groupBt);
        var _AutoBt = this.add.button(333, 671, 'AutoBt', this.OnBtAuto, this, 0, 0, 1, 0, _groupBt);
        var _DoubleLBt = this.add.button(210, 672, 'DoubleLBt', this.OnBtDoubleL, this, 0, 0, 1, 0, _groupBt);
        var _DoubleRBt = this.add.button(270, 672, 'DoubleRBt', this.OnBtDoubleR, this, 0, 0, 1, 0, _groupBt);
        var _FunctionBt = this.add.button(477, 7, 'FunctionBt', this.OnBtFunction, this, 0, 0, 1, 0, _groupBt);
        var _HomeBt = this.add.button(5, 7, 'HomeBt', this.OnBtHome, this, 0, 0, 1, 0, _groupBt);
        var _Symbol01Bt = this.add.button(-13, 843, 'Symbol01Bt', this.OnBtSym01, this, 0, 0, 1, 0, _groupBt);
        var _Symbol02Bt = this.add.button(58, 843, 'Symbol02Bt', this.OnBtSym02, this, 0, 0, 1, 0, _groupBt);
        var _Symbol03Bt = this.add.button(129, 843, 'Symbol03Bt', this.OnBtSym03, this, 0, 0, 1, 0, _groupBt);
        var _Symbol04Bt = this.add.button(201, 843, 'Symbol04Bt', this.OnBtSym04, this, 0, 0, 1, 0, _groupBt);
        var _Symbol05Bt = this.add.button(270, 843, 'Symbol05Bt', this.OnBtSym05, this, 0, 0, 1, 0, _groupBt);
        var _Symbol06Bt = this.add.button(333, 843, 'Symbol06Bt', this.OnBtSym06, this, 0, 0, 1, 0, _groupBt);
        var _Symbol07Bt = this.add.button(397, 843, 'Symbol07Bt', this.OnBtSym07, this, 0, 0, 1, 0, _groupBt);
        var _Symbol08Bt = this.add.button(461, 843, 'Symbol08Bt', this.OnBtSym08, this, 0, 0, 1, 0, _groupBt);
        var _groupSymbolNormal = this.add.group();
        this.add.sprite(484, 767, 'Pay005x', null, _groupSymbolNormal);
        this.add.sprite(36, 767, 'Pay100x', null, _groupSymbolNormal);
        this.add.sprite(407, 767, 'Pay010x_2', null, _groupSymbolNormal);
        this.add.sprite(355, 767, 'Pay015x_2', null, _groupSymbolNormal);
        this.add.sprite(303, 767, 'Pay020x_2', null, _groupSymbolNormal);
        this.add.sprite(216, 767, 'Pay020x_2', null, _groupSymbolNormal);
        this.add.sprite(164, 767, 'Pay030x_2', null, _groupSymbolNormal);
        this.add.sprite(112, 767, 'Pay040x_2', null, _groupSymbolNormal);
        var _PayFrameLightRight0 = this.add.sprite(392, 764, 'PayFrameLight', null, _groupSymbolNormal);
        var _PayFrameLightRight1 = this.add.sprite(340, 764, 'PayFrameLight', null, _groupSymbolNormal);
        var _PayFrameLightRight2 = this.add.sprite(288, 764, 'PayFrameLight', null, _groupSymbolNormal);
        var _PayFrameLightLeft0 = this.add.sprite(202, 764, 'PayFrameLight', null, _groupSymbolNormal);
        var _PayFrameLightLeft1 = this.add.sprite(150, 764, 'PayFrameLight', null, _groupSymbolNormal);
        var _PayFrameLightLeft2 = this.add.sprite(98, 764, 'PayFrameLight', null, _groupSymbolNormal);
        var _Pay010x_1Right0 = this.add.sprite(407, 767, 'Pay010x_1', null, _groupSymbolNormal);
        var _Pay015x_1Right1 = this.add.sprite(355, 767, 'Pay015x_1', null, _groupSymbolNormal);
        var _Pay020x_1Right2 = this.add.sprite(303, 767, 'Pay020x_1', null, _groupSymbolNormal);
        var _Pay020x_1Left0 = this.add.sprite(216, 767, 'Pay020x_1', null, _groupSymbolNormal);
        var _Pay030x_1Left1 = this.add.sprite(164, 767, 'Pay030x_1', null, _groupSymbolNormal);
        var _Pay040x_1Left2 = this.add.sprite(112, 767, 'Pay040x_1', null, _groupSymbolNormal);
        var _JackpotLamp = this.add.sprite(216, 367, 'JackpotLamp', 0, _groupSymbolNormal);
        _JackpotLamp.animations.add('loop', [0, 1], 20, false);
        var _groupSymbolLight = this.add.group();
        var _groupLightNormal = this.add.group();
        var _groupLightLight = this.add.group();
        var _groupNumber = this.add.group();
        this.add.sprite(464, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(439, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(414, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(389, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(364, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(339, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(314, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(289, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(224, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(199, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(174, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(149, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(124, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(99, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(74, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(49, 119, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(36, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(51, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(99, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(114, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(162, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(177, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(225, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(240, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(288, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(303, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(351, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(366, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(414, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(429, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(477, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(492, 803, 'BetEightBg', null, _groupNumber);
        this.add.sprite(233, 517, 'DoubleFrame', null, _groupNumber);
        this.add.sprite(270, 525, 'CreditEightBg', null, _groupNumber);
        this.add.sprite(245, 525, 'CreditEightBg', null, _groupNumber);
        // public fields
        this.fGameBackground = _GameBackground;
        this.fGroupHistory = _groupHistory;
        this.fCenterSignIdle1 = _centerSignIdle1;
        this.fCenterSignIdle1_play = _centerSignIdle1_play;
        this.fCenterSignIdle2 = _centerSignIdle2;
        this.fCenterSignIdle2_play = _centerSignIdle2_play;
        this.fCenterSignIdle3 = _centerSignIdle3;
        this.fCenterSignIdle3_play = _centerSignIdle3_play;
        this.fCenterSignIdle4 = _centerSignIdle4;
        this.fCenterSignIdle4_play = _centerSignIdle4_play;
        this.fCenterSignWin1 = _centerSignWin1;
        this.fCenterSignWin1_play = _centerSignWin1_play;
        this.fCenterSignWin2 = _centerSignWin2;
        this.fCenterSignWin2_play = _centerSignWin2_play;
        this.fWinBoltLeft = _WinBoltLeft;
        this.fWinBoltRight = _WinBoltRight;
        this.fStartBt = _StartBt;
        this.fAutoBt = _AutoBt;
        this.fDoubleLBt = _DoubleLBt;
        this.fDoubleRBt = _DoubleRBt;
        this.fFunctionBt = _FunctionBt;
        this.fHomeBt = _HomeBt;
        this.fSymbol01Bt = _Symbol01Bt;
        this.fSymbol02Bt = _Symbol02Bt;
        this.fSymbol03Bt = _Symbol03Bt;
        this.fSymbol04Bt = _Symbol04Bt;
        this.fSymbol05Bt = _Symbol05Bt;
        this.fSymbol06Bt = _Symbol06Bt;
        this.fSymbol07Bt = _Symbol07Bt;
        this.fSymbol08Bt = _Symbol08Bt;
        this.fGroupSymbolNormal = _groupSymbolNormal;
        this.fPayFrameLightRight0 = _PayFrameLightRight0;
        this.fPayFrameLightRight1 = _PayFrameLightRight1;
        this.fPayFrameLightRight2 = _PayFrameLightRight2;
        this.fPayFrameLightLeft0 = _PayFrameLightLeft0;
        this.fPayFrameLightLeft1 = _PayFrameLightLeft1;
        this.fPayFrameLightLeft2 = _PayFrameLightLeft2;
        this.fPay010x_1Right0 = _Pay010x_1Right0;
        this.fPay015x_1Right1 = _Pay015x_1Right1;
        this.fPay020x_1Right2 = _Pay020x_1Right2;
        this.fPay020x_1Left0 = _Pay020x_1Left0;
        this.fPay030x_1Left1 = _Pay030x_1Left1;
        this.fPay040x_1Left2 = _Pay040x_1Left2;
        this.fJackpotLamp = _JackpotLamp;
        this.fGroupSymbolLight = _groupSymbolLight;
        this.fGroupLightNormal = _groupLightNormal;
        this.fGroupLightLight = _groupLightLight;
        this.fGroupNumber = _groupNumber;
        this.afterCreate();
    };
    Level.prototype.afterConstructor = function () {
        //console.log("Level::afterConstructor") ;
        this.gameNumber = new GameNumber(this);
        this.gameRoller = new GameRoller(this);
        this.gameAnm = new GameAnm(this);
        this.gameHistory = new GameHistory(this);
        this.gameBt = new GameBt(this);
        this.gameDouble = new GameDouble(this);
        this.sceneGame = new SceneGame(this, this.gameNumber, this.gameRoller, this.gameAnm, this.gameHistory, this.gameBt, this.gameDouble);
        this.gameRoller.setSceneGame(this.sceneGame);
        this.gameDouble.setSceneGame(this.sceneGame, this.gameNumber);
    };
    Level.prototype.afterInit = function () {
        //console.log("Level::afterInit") ;
    };
    Level.prototype.afterPreload = function () {
        //console.log("Level::afterPreload") ;
        this.textLoading = this.game.add.text(30, this.game.world.centerY, 'Start', { fill: '#888888' });
        this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);
    };
    Level.prototype.afterCreate = function () {
        //console.log("Level::afterCreate") ;
        this.gameNumber.create();
        this.gameAnm.create();
        this.gameRoller.create();
        this.sceneGame.create(); //create is go after preload
    };
    Level.prototype.loadStart = function () {
        this.textLoading.setText("Loading ...");
    };
    //  This callback is sent the following parameters:
    Level.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
        //this.text.setText("File Complete: " + cacheKey + " " + progress + "% - " + 
        //        totalLoaded + " out of " + totalFiles);
        this.textLoading.setText("Loading... " + progress + "%");
    };
    Level.prototype.loadComplete = function () {
        this.textLoading.setText("Load Complete");
        this.textLoading.visible = false;
    };
    Level.prototype.update = function () {
        this.sceneGame.update();
    };
    Level.prototype.OnBtAuto = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtAuto();
    };
    Level.prototype.OnBtStart = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtStart();
    };
    Level.prototype.OnBtDoubleL = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtDoubleL();
    };
    Level.prototype.OnBtDoubleR = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtDoubleR();
    };
    Level.prototype.OnBtFunction = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtFunction();
    };
    Level.prototype.OnBtHome = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtHome();
    };
    Level.prototype.OnBtSym01 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(0); // Start from 0
    };
    Level.prototype.OnBtSym02 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(1); // Start from 0
    };
    Level.prototype.OnBtSym03 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(2); // Start from 0
    };
    Level.prototype.OnBtSym04 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(3); // Start from 0
    };
    Level.prototype.OnBtSym05 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(4); // Start from 0
    };
    Level.prototype.OnBtSym06 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(5); // Start from 0
    };
    Level.prototype.OnBtSym07 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(6); // Start from 0
    };
    Level.prototype.OnBtSym08 = function () {
        this.game.sound.play("CS_PressBt");
        this.sceneGame.OnBtSymbol(7); // Start from 0
    };
    return Level;
}(Phaser.State));
/* --- end generated code --- */
// -- user code here --

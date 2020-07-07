webpackJsonp([0,3],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var State = (function (_super) {
    __extends(State, _super);
    function State() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return State;
}(Phaser.State));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = State;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Imports */
var state_1 = __webpack_require__(1);
// The first (boot) state of the game
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BootState.prototype.create = function () {
        this.game.state.start('preloader');
    };
    return BootState;
}(state_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BootState;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Imports */
var state_1 = __webpack_require__(1);
var TileType;
(function (TileType) {
    TileType[TileType["Floor"] = 0] = "Floor";
    TileType[TileType["Hay"] = 1] = "Hay";
    TileType[TileType["Wall"] = 2] = "Wall";
})(TileType || (TileType = {}));
var Tile = (function () {
    function Tile(game, id, sprite) {
        this.game = game;
        this.sprite = sprite;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.setTileType(id);
        if (id === TileType.Wall) {
            this.game.physics.p2.enable(this.sprite);
            this.sprite.body.kinematic = true;
            this.sprite.body.static = true;
        }
    }
    Tile.prototype.setTileType = function (id) {
        this.type = id;
        this.sprite.frame = this.type;
    };
    Object.defineProperty(Tile.prototype, "visible", {
        get: function () {
            return this.sprite.visible;
        },
        set: function (value) {
            this.sprite.visible = value;
            if (this.type === TileType.Wall) {
                if (value) {
                    this.sprite.body.addToWorld();
                }
                else {
                    this.sprite.body.removeFromWorld();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Tile.prototype.ckeckCollision = function (pos) {
        var width = pos.x - this.sprite.position.x;
        var height = pos.y - this.sprite.position.y;
        if (Math.sqrt((width * width) + (height * height)) <= 20) {
            return true;
        }
        else {
            return false;
        }
    };
    Tile.prototype.hitBullet = function (point) {
        if (this.type === TileType.Hay) {
            this.type = TileType.Floor;
            this.sprite.frame = TileType.Floor;
        }
    };
    return Tile;
}());
// The main state of the game
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.TILE_WIDTH = 32;
        _this.VISIBLE_TILE_RADIUS = 15; // test will be 5
        return _this;
    }
    MainState.prototype.create = function () {
        var _this = this;
        // Init
        this.tiles = [];
        this.allTileIndex = [];
        this.game.world.setBounds(-10000, -10000, 19200, 19200);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        // Tile group
        this.tileGroup = new Phaser.Group(this.game);
        // Tank
        this.tankSprite = this.game.add.sprite(0, 0, 'tankImage');
        this.tankSprite.anchor.setTo(0.5, 0.5);
        this.game.physics.p2.enable(this.tankSprite);
        this.tankSprite.body.setCircle(15);
        this.tankSprite.body.damping = 0.95;
        this.game.camera.follow(this.tankSprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // Bullet
        this.bulletSprite = this.game.add.sprite(0, 0, 'bulletImage');
        this.bulletSprite.anchor.setTo(0.5, 0.5);
        this.bulletSprite.visible = false;
        this.bulletVelocity = new Phaser.Point(0, 0);
        // Tile init
        this.tileAssign();
        // Bullet
        this.game.input.keyboard.addKey(Phaser.KeyCode.ONE).onDown.add(function () {
            if (!_this.bulletSprite.visible) {
                var lootAt = new Phaser.Point(Math.cos(Phaser.Math.degToRad(_this.tankSprite.body.angle - 90)), Math.sin(Phaser.Math.degToRad(_this.tankSprite.body.angle - 90)));
                _this.bulletSprite.visible = true;
                _this.bulletSprite.position.setTo(_this.tankSprite.position.x + (lootAt.x * 18), _this.tankSprite.position.y + (lootAt.y * 18));
                _this.bulletVelocity.x = lootAt.x * 300;
                _this.bulletVelocity.y = lootAt.y * 300;
            }
        });
        // Cursor
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    MainState.prototype.update = function () {
        // input and move
        this.tankSprite.body.setZeroRotation();
        var move = false;
        if (this.cursors.up.isDown) {
            this.tankSprite.body.thrust(400);
            move = true;
        }
        else if (this.cursors.down.isDown) {
            this.tankSprite.body.thrust(-400);
            move = true;
        }
        if (this.cursors.left.isDown) {
            this.tankSprite.body.rotateLeft(100);
            move = true;
        }
        else if (this.cursors.right.isDown) {
            this.tankSprite.body.rotateRight(100);
            move = true;
        }
        // Bullet
        if (this.bulletSprite.visible) {
            this.bulletSprite.position.setTo(this.bulletSprite.position.x + (this.bulletVelocity.x * this.game.time.elapsed / 1000), this.bulletSprite.position.y + (this.bulletVelocity.y * this.game.time.elapsed / 1000));
            var pos = this.bulletSprite.position;
            if (pos.x >= this.rightBoundry * this.TILE_WIDTH || pos.x <= this.leftBoundry * this.TILE_WIDTH ||
                pos.y >= this.bottomBoundry * this.TILE_WIDTH || pos.y <= this.topBoundry * this.TILE_WIDTH) {
                this.bulletSprite.visible = false;
            }
            else {
                var xless = (this.bulletSprite.position.x / this.TILE_WIDTH | 0) - 2;
                var xMore = (this.bulletSprite.position.x / this.TILE_WIDTH | 0) + 2;
                var yless = (this.bulletSprite.position.y / this.TILE_WIDTH | 0) - 2;
                var yMore = (this.bulletSprite.position.y / this.TILE_WIDTH | 0) + 2;
                for (var iX = xless; iX <= xMore; iX++) {
                    for (var iY = yless; iY <= yMore; iY++) {
                        if (iX < this.leftBoundry || iX > this.rightBoundry || iY < this.topBoundry || iY > this.bottomBoundry) {
                            continue;
                        }
                        if (this.tiles[iX][iY].type !== TileType.Floor) {
                            if (this.tiles[iX][iY].ckeckCollision(this.bulletSprite.position)) {
                                this.bulletSprite.visible = false;
                                if (this.tiles[iX][iY].type === TileType.Hay) {
                                    this.tiles[iX][iY].hitBullet(100);
                                }
                                break;
                            }
                        }
                    }
                    if (this.bulletSprite.visible === false) {
                        break;
                    }
                }
            }
        }
        // Tile assign (create, show & hide)
        if (move) {
            this.tileAssign();
        }
    };
    MainState.prototype.tileAssign = function () {
        var _this = this;
        // Count boundry
        var totalRadius = this.TILE_WIDTH * this.VISIBLE_TILE_RADIUS;
        this.leftBoundry = (this.tankSprite.position.x - totalRadius) / this.TILE_WIDTH | 0;
        this.rightBoundry = (this.tankSprite.position.x + totalRadius) / this.TILE_WIDTH | 0;
        this.topBoundry = (this.tankSprite.position.y - totalRadius) / this.TILE_WIDTH | 0;
        this.bottomBoundry = (this.tankSprite.position.y + totalRadius) / this.TILE_WIDTH | 0;
        // visible in boundry
        for (var iX = this.leftBoundry; iX <= this.rightBoundry; iX++) {
            for (var iY = this.topBoundry; iY <= this.bottomBoundry; iY++) {
                if (!this.checkTileExistAnyArrayIt(iX, iY)) {
                    var tileSprite = this.game.add.sprite(iX * this.TILE_WIDTH, iY * this.TILE_WIDTH, 'tileImage', 0, this.tileGroup);
                    var randID = this.game.rnd.integerInRange(0, 10);
                    if (randID < 9) {
                        randID = 0;
                    }
                    else if (randID === 9) {
                        randID = 1;
                    }
                    else if (randID === 10) {
                        randID = 2;
                    }
                    this.tiles[iX][iY] = new Tile(this.game, randID, tileSprite);
                    this.allTileIndex.push(new Phaser.Point(iX, iY));
                }
                else {
                    this.tiles[iX][iY].visible = true;
                }
            }
        }
        // invisivle out of boundry
        this.allTileIndex.forEach(function (value, index, array) {
            if (value.x < _this.leftBoundry || value.x > _this.rightBoundry || value.y < _this.topBoundry || value.y > _this.bottomBoundry) {
                if (_this.tiles[value.x][value.y].visible === true) {
                    _this.tiles[value.x][value.y].visible = false;
                }
            }
        });
    };
    MainState.prototype.checkTileExistAnyArrayIt = function (inX, inY) {
        var isExist = true;
        if (!this.tiles[inX]) {
            isExist = false;
            this.tiles[inX] = [];
        }
        if (!this.tiles[inX][inY]) {
            isExist = false;
        }
        return isExist;
    };
    return MainState;
}(state_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MainState;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Imports */
var state_1 = __webpack_require__(1);
// Webpack will replace these imports with a URLs to images
var skyImage = __webpack_require__(14); // const skyImage = '/assets/images/sky.png';
var platformImage = __webpack_require__(13);
var starImage = __webpack_require__(15);
var dudeImage = __webpack_require__(12);
var tileImage = __webpack_require__(17);
var tankImage = __webpack_require__(16);
var bulletImage = __webpack_require__(11);
// The state for loading core resources for the game
var PreloaderState = (function (_super) {
    __extends(PreloaderState, _super);
    function PreloaderState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloaderState.prototype.preload = function () {
        console.debug('Assets loading started');
        this.game.load.image('sky', skyImage);
        this.game.load.image('platform', platformImage);
        this.game.load.image('star', starImage);
        this.game.load.spritesheet('dude', dudeImage, 32, 48);
        this.game.load.spritesheet('tileImage', tileImage, 32, 32);
        this.game.load.image('tankImage', tankImage);
        this.game.load.image('bulletImage', bulletImage);
    };
    PreloaderState.prototype.create = function () {
        console.debug('Assets loading completed');
        this.game.state.start('main'); // Switch to main game state
    };
    return PreloaderState;
}(state_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PreloaderState;


/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/bullet.png";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/dude.png";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/platform.png";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/sky.png";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/star.png";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/tank.png";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/tile.png";

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Imports */
// Import global dependencies. (I remind you, webpack create separate chunk file for them).
__webpack_require__(5); // Because Phaser use PIXI and p2 as global variables, they must be imported first.
__webpack_require__(7);
__webpack_require__(6); // So, in my case, TypeScript breaks if i import it as `import 'phaser';`. ¯\_(ツ)_/¯
__webpack_require__(8); // Registering styles for the page; They will automatically inject.
var boot_state_1 = __webpack_require__(2);
var preloader_state_1 = __webpack_require__(4);
var main_state_1 = __webpack_require__(3);
// The main class of our application
var App = (function (_super) {
    __extends(App, _super);
    function App(config) {
        var _this = _super.call(this, config) || this;
        _this.state.add('boot', boot_state_1.default);
        _this.state.add('preloader', preloader_state_1.default);
        _this.state.add('main', main_state_1.default); // Add `main` state into game
        _this.state.start('boot'); // Initialize and start `boot` state
        return _this;
    }
    return App;
}(Phaser.Game));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
// Like python's `__name__ == "__main__"` checks whether the module is part
// of another program or it is executable.
if (!module.parent) {
    window.onload = function () {
        var config = {
            width: 800,
            height: 600,
            renderer: Phaser.AUTO,
            parent: '',
            resolution: 1,
            forceSetTimeOut: false // tell Phaser to use `setTimeOut` even if `requestAnimationFrame` is available.
        };
        new App(config); // Initialize the application. It will automatically inject <canvas /> into <body />
    };
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module)))

/***/ })
],[26]);
//# sourceMappingURL=main.js.map
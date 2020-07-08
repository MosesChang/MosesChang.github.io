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
    function Tile(game, id, sprite, effectGroup) {
        this.ORIGIN_HP = [Number.POSITIVE_INFINITY, 100, Number.POSITIVE_INFINITY];
        this.game = game;
        this.sprite = sprite;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.setTileType(id);
        this.hp = this.ORIGIN_HP[this.type];
        if (id === TileType.Wall) {
            // Wall add to physic
            this.game.physics.p2.enable(this.sprite);
            this.sprite.body.kinematic = true;
            this.sprite.body.static = true;
        }
        else if (id === TileType.Hay) {
            // Hay add effect
            this.effectSprite = this.game.add.sprite(0, 0, 'tileImage', id, effectGroup);
            this.effectSprite.position.setTo(this.sprite.position.x, this.sprite.position.y);
            this.effectSprite.anchor.setTo(0.5, 0.5);
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
    Tile.prototype.hitBullet = function (damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.setTileType(TileType.Floor);
            this.hp = this.ORIGIN_HP[TileType.Floor];
            if (this.effectSprite) {
                this.effectSprite.visible = false;
            }
        }
        else if (this.type === TileType.Hay) {
            this.game.add.tween(this.effectSprite.scale).to({ x: 1.5, y: 1.5 }, 100, Phaser.Easing.Cubic.Out, true, 0, 0, true);
        }
    };
    return Tile;
}());
// The main state of the game
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.aPress = false;
        _this.bPress = false;
        _this.rPress = false;
        _this.lPress = false;
        _this.uPress = false;
        _this.dPress = false;
        _this.BULLET_DAMAGE = [10, 20, 25];
        _this.TANK_THRUST = 400;
        _this.TANK_ROTATE = 50;
        _this.BULLET_VELOCITY = 400;
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
        this.tileEffectGroup = new Phaser.Group(this.game);
        // Tank
        this.tankSprite = this.game.add.sprite(0, 0, 'tankImage', 0);
        this.tankSprite.anchor.setTo(0.5, 0.5);
        this.game.physics.p2.enable(this.tankSprite);
        this.tankSprite.body.setCircle(15);
        this.tankSprite.body.damping = 0.95;
        this.game.camera.follow(this.tankSprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        // Bullet
        this.bulletSprite = this.game.add.sprite(0, 0, 'bulletImage', 0);
        this.bulletSprite.anchor.setTo(0.5, 0.5);
        this.bulletSprite.visible = false;
        this.bulletVelocity = new Phaser.Point(0, 0);
        // Tile init
        this.tileAssign();
        // Bullet fire
        this.game.input.keyboard.addKey(Phaser.KeyCode.ONE).onDown.add(function () { return _this.bulletFire(); });
        // Tank color
        this.game.input.keyboard.addKey(Phaser.KeyCode.TWO).onDown.add(function () { return _this.changeTankColor(); });
        // Pad
        this.initBts();
        // Cursor
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    MainState.prototype.update = function () {
        // input and move
        this.tankSprite.body.setZeroRotation();
        var move = false;
        if (this.cursors.up.isDown || this.uPress) {
            this.tankSprite.body.thrust(this.TANK_THRUST);
            move = true;
        }
        else if (this.cursors.down.isDown || this.dPress) {
            this.tankSprite.body.thrust(-this.TANK_THRUST);
            move = true;
        }
        if (this.cursors.left.isDown || this.lPress) {
            this.tankSprite.body.rotateLeft(this.TANK_ROTATE);
        }
        else if (this.cursors.right.isDown || this.rPress) {
            this.tankSprite.body.rotateRight(this.TANK_ROTATE);
        }
        // Bullet move & collision
        this.bulletMoveCollision();
        // Pad position follow camera
        this.aBt.position.setTo(this.game.camera.position.x + 580, this.game.camera.position.y + 460);
        this.bBt.position.setTo(this.game.camera.position.x + 680, this.game.camera.position.y + 460);
        this.rBt.position.setTo(this.game.camera.position.x + 500, this.game.camera.position.y + 478);
        this.lBt.position.setTo(this.game.camera.position.x + 380, this.game.camera.position.y + 478);
        this.uBt.position.setTo(this.game.camera.position.x + 445, this.game.camera.position.y + 410);
        this.dBt.position.setTo(this.game.camera.position.x + 445, this.game.camera.position.y + 532);
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
                    this.tiles[iX][iY] = new Tile(this.game, randID, tileSprite, this.tileEffectGroup);
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
    MainState.prototype.bulletMoveCollision = function () {
        if (this.bulletSprite.visible) {
            // Bullet move
            this.bulletSprite.position.setTo(this.bulletSprite.position.x + (this.bulletVelocity.x * this.game.time.elapsed / 1000), this.bulletSprite.position.y + (this.bulletVelocity.y * this.game.time.elapsed / 1000));
            var pos = this.bulletSprite.position;
            // Boundry check
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
                                // Hit hey
                                if (this.tiles[iX][iY].type === TileType.Hay) {
                                    this.tiles[iX][iY].hitBullet(this.BULLET_DAMAGE[this.bulletSprite.frame]);
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
    };
    MainState.prototype.initBts = function () {
        var _this = this;
        this.aPress = false;
        this.aBt = this.game.add.button(0, 0, 'xbox360', undefined, this, '360_A', '360_A', '360_A');
        this.aBt.alpha = 0.5;
        this.aBt.events.onInputDown.add(function () {
            _this.aPress = true;
            _this.aBt.alpha = 1;
            _this.bulletFire();
        }, this);
        this.aBt.events.onInputOut.add(function () {
            _this.aPress = false;
            _this.aBt.alpha = 0.5;
        }, this);
        this.aBt.events.onInputUp.add(function () {
            _this.aPress = false;
            _this.aBt.alpha = 0.5;
        }, this);
        this.bPress = false;
        this.bBt = this.game.add.button(0, 0, 'xbox360', undefined, this, '360_B', '360_B', '360_B');
        this.bBt.alpha = 0.5;
        this.bBt.events.onInputDown.add(function () {
            _this.bPress = true;
            _this.bBt.alpha = 1;
            _this.changeTankColor();
        }, this);
        this.bBt.events.onInputOut.add(function () {
            _this.bPress = false;
            _this.bBt.alpha = 0.5;
        }, this);
        this.bBt.events.onInputUp.add(function () {
            _this.bPress = false;
            _this.bBt.alpha = 0.5;
        }, this);
        this.rPress = false;
        this.rBt = this.game.add.button(0, 0, 'rBtImage', undefined, this, 0, 0, 0);
        this.rBt.alpha = 0.5;
        this.rBt.events.onInputDown.add(function () {
            _this.rPress = true;
            _this.rBt.alpha = 1;
        }, this);
        this.rBt.events.onInputOut.add(function () {
            _this.rPress = false;
            _this.rBt.alpha = 0.5;
        }, this);
        this.rBt.events.onInputUp.add(function () {
            _this.rPress = false;
            _this.rBt.alpha = 0.5;
        }, this);
        this.lPress = false;
        this.lBt = this.game.add.button(0, 0, 'lBtImage', undefined, this, 0, 0, 0);
        this.lBt.alpha = 0.5;
        this.lBt.events.onInputDown.add(function () {
            _this.lPress = true;
            _this.lBt.alpha = 1;
        }, this);
        this.lBt.events.onInputOut.add(function () {
            _this.lPress = false;
            _this.lBt.alpha = 0.5;
        }, this);
        this.lBt.events.onInputUp.add(function () {
            _this.lPress = false;
            _this.lBt.alpha = 0.5;
        }, this);
        this.uPress = false;
        this.uBt = this.game.add.button(0, 0, 'uBtImage', undefined, this, 0, 0, 0);
        this.uBt.alpha = 0.5;
        this.uBt.events.onInputDown.add(function () {
            _this.uPress = true;
            _this.uBt.alpha = 1;
        }, this);
        this.uBt.events.onInputOut.add(function () {
            _this.uPress = false;
            _this.uBt.alpha = 0.5;
        }, this);
        this.uBt.events.onInputUp.add(function () {
            _this.uPress = false;
            _this.uBt.alpha = 0.5;
        }, this);
        this.dPress = false;
        this.dBt = this.game.add.button(0, 0, 'dBtImage', undefined, this, 0, 0, 0);
        this.dBt.alpha = 0.5;
        this.dBt.events.onInputDown.add(function () {
            _this.dPress = true;
            _this.dBt.alpha = 1;
        }, this);
        this.dBt.events.onInputOut.add(function () {
            _this.dPress = false;
            _this.dBt.alpha = 0.5;
        }, this);
        this.dBt.events.onInputUp.add(function () {
            _this.dPress = false;
            _this.dBt.alpha = 0.5;
        }, this);
    };
    MainState.prototype.bulletFire = function () {
        if (!this.bulletSprite.visible) {
            var recoil = (this.tankSprite.frame + 1) * 0.9 * -this.TANK_THRUST;
            this.tankSprite.body.thrust(recoil);
            var lootAt = new Phaser.Point(Math.cos(Phaser.Math.degToRad(this.tankSprite.body.angle - 90)), Math.sin(Phaser.Math.degToRad(this.tankSprite.body.angle - 90)));
            this.bulletSprite.visible = true;
            this.bulletSprite.frame = this.tankSprite.frame;
            this.bulletSprite.position.setTo(this.tankSprite.position.x + (lootAt.x * 18), this.tankSprite.position.y + (lootAt.y * 18));
            this.bulletVelocity.x = lootAt.x * this.BULLET_VELOCITY;
            this.bulletVelocity.y = lootAt.y * this.BULLET_VELOCITY;
        }
    };
    MainState.prototype.changeTankColor = function () {
        var frameID = this.tankSprite.frame;
        frameID++;
        if (frameID > 2) {
            frameID = 0;
        }
        this.tankSprite.frame = frameID;
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
var xbox360Image = __webpack_require__(19);
var xbox360Json = __webpack_require__(18);
var rBtImage = __webpack_require__(14);
var uBtImage = __webpack_require__(17);
var lBtImage = __webpack_require__(13);
var dBtImage = __webpack_require__(12);
var tileImage = __webpack_require__(16);
var tankImage = __webpack_require__(15);
var bulletImage = __webpack_require__(11);
// The state for loading core resources for the game
var PreloaderState = (function (_super) {
    __extends(PreloaderState, _super);
    function PreloaderState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloaderState.prototype.preload = function () {
        console.debug('Assets loading started');
        this.game.load.atlas('xbox360', xbox360Image, xbox360Json);
        this.game.load.image('rBtImage', rBtImage);
        this.game.load.image('uBtImage', uBtImage);
        this.game.load.image('lBtImage', lBtImage);
        this.game.load.image('dBtImage', dBtImage);
        this.game.load.spritesheet('tileImage', tileImage, 32, 32);
        this.game.load.spritesheet('tankImage', tankImage, 31, 40);
        this.game.load.spritesheet('bulletImage', bulletImage, 17, 17);
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

module.exports = __webpack_require__.p + "assets/images/dBt.png";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/lBt.png";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/rBt.png";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/tank.png";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/tile.png";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/uBt.png";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/xbox360.json";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/xbox360.png";

/***/ }),
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
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
],[28]);
//# sourceMappingURL=main.js.map
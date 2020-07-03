webpackJsonp([1,3],[
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
// The main state of the game
var MainState = (function (_super) {
    __extends(MainState, _super);
    function MainState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainState.prototype.create = function () {
        // Phaser supports some physical engines (p2, box2d, ninja and arcate).
        // For our game, we don't need a strong physical simulation, so we'll choose
        // `arcade` model.
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        // Add a simple background
        this.sky = this.game.add.sprite(0, 0, 'sky');
        // Also we create a group for platforms
        this.platforms = this.game.add.group();
        // and enable physics for any object that is created in this group
        this.platforms.enableBody = true;
        // Create the ground
        var ground = this.platforms.create(0, this.game.world.height - 64, 'platform');
        // and scale it to fit the width of the game (the original sprite
        // size - 400x32, width of the game - 800)
        ground.scale.setTo(2, 2);
        // And make it immovable (Otherwise it will fall when we jump on it).
        ground.body.immovable = true;
        // Also add two ledges
        var ledge1 = this.platforms.create(400, 400, 'platform');
        ledge1.body.immovable = true;
        var ledge2 = this.platforms.create(-150, 250, 'platform');
        ledge2.body.immovable = true;
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
var skyImage = __webpack_require__(13); // const skyImage = '/assets/images/sky.png';
var platformImage = __webpack_require__(12);
var starImage = __webpack_require__(14);
var dudeImage = __webpack_require__(11);
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

module.exports = __webpack_require__.p + "assets/images/dude.png";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/platform.png";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/sky.png";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/images/star.png";

/***/ }),
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
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
],[23]);
//# sourceMappingURL=main.js.map
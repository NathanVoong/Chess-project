"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
var helperFunctions_1 = require("./helperFunctions");
var ChessColour;
(function (ChessColour) {
    ChessColour["White"] = "white";
    ChessColour["Black"] = "black";
})(ChessColour || (ChessColour = {}));
var Piece = /** @class */ (function () {
    function Piece(position, colour) {
        this.position = position;
        this.colour = colour;
    }
    return Piece;
}());
exports.Piece = Piece;
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King(position, colour) {
        return _super.call(this, position, colour) || this;
    }
    King.prototype.move = function (toPosition) {
        // Implement the specific movement logic for the king
        var targetFile = toPosition[0], targetRank = toPosition[1];
        var _a = this.position, currentFile = _a[0], currentRank = _a[1];
        var fileDiff = Math.abs(targetFile - currentFile);
        var rankDiff = Math.abs(targetRank - currentRank);
        // maximum 1 move outwards in any direction and the position must be valid
        if (fileDiff <= 1 && rankDiff <= 1 && (0, helperFunctions_1.validPosition)(toPosition)) {
            // Valid move for the king
            this.position = toPosition;
            console.log('King moved to', toPosition);
        }
        else {
            console.log('Invalid move for the king');
        }
    };
    return King;
}(Piece));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen(position, colour) {
        return _super.call(this, position, colour) || this;
    }
    Queen.prototype.move = function (toPosition) {
        // Implement the specific movement logic for the king
        var targetFile = toPosition[0], targetRank = toPosition[1];
        var _a = this.position, currentFile = _a[0], currentRank = _a[1];
        var fileDiff = Math.abs(targetFile - currentFile);
        var rankDiff = Math.abs(targetRank - currentRank);
        // maximum 1 move outwards in any direction and the position must be valid
        if (fileDiff <= 1 && rankDiff <= 1 && (0, helperFunctions_1.validPosition)(toPosition)) {
            // Valid move for the king
            this.position = toPosition;
            console.log('King moved to', toPosition);
        }
        else {
            console.log('Invalid move for the king');
        }
    };
    return Queen;
}(Piece));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop(position, colour) {
        return _super.call(this, position, colour) || this;
    }
    return Bishop;
}(Piece));
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight(position, colour) {
        return _super.call(this, position, colour) || this;
    }
    return Knight;
}(Piece));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook(position, colour) {
        return _super.call(this, position, colour) || this;
    }
    return Rook;
}(Piece));
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    function Pawn(position, colour) {
        return _super.call(this, position, colour) || this;
    }
    return Pawn;
}(Piece));
var king = new King([4, 4], ChessColour.White);
king.move([4, 3]);

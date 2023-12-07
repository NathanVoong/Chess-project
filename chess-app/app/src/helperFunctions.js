"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPosition = void 0;
//bug - add error for invalid types
function validPosition(position) {
    var file = position[0], rank = position[1];
    if (file <= 0 || rank <= 0 || file > 8 || rank > 8) {
        return false;
    }
    else {
        return true;
    }
}
exports.validPosition = validPosition;
//console.log(validPosition([1,1]))

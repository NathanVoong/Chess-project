import { validPosition } from './helperFunctions'
enum ChessColour {
    White = "white",
    Black = "black",
}
export class Piece {
    position: [number, number]
    colour: ChessColour
    constructor(position: [number, number], colour: ChessColour) {
        this.position = position;
        this.colour = colour;
    }
}

class King extends Piece {
    constructor(position: [number, number], colour: ChessColour) {
        super(position, colour);
    }
    move(toPosition: [number, number]): void {
        // Implement the specific movement logic for the king
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // maximum 1 move outwards in any direction and the position must be valid
        if (fileDiff <= 1 && rankDiff <= 1 && validPosition(toPosition)) {
            // Valid move for the king
            this.position = toPosition;
            console.log('King moved to', toPosition);
        } else {
            console.log('Invalid move for the king');
        }
    }

}

class Queen extends Piece {
    constructor(position: [number, number], colour: ChessColour) {
        super(position, colour);
    }
    move(toPosition: [number, number]): void {
        // Implement the specific movement logic for the king
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // maximum 1 move outwards in any direction and the position must be valid
        if (fileDiff <= 1 && rankDiff <= 1 && validPosition(toPosition)) {
            // Valid move for the king
            this.position = toPosition;
            console.log('King moved to', toPosition);
        } else {
            console.log('Invalid move for the king');
        }
    }
}

class Bishop extends Piece {
    constructor(position: [number, number], colour: ChessColour) {
        super(position, colour);
    }
}

class Knight extends Piece {
    constructor(position: [number, number], colour: ChessColour) {
        super(position, colour);
    }
}

class Rook extends Piece {
    constructor(position: [number, number], colour: ChessColour) {
        super(position, colour);
    }
}

class Pawn extends Piece {
    constructor(position: [number, number], colour: ChessColour) {
        super(position, colour);
    }
}

const king = new King([4,4], ChessColour.White)
king.move([4,3])

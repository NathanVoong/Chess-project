enum ChessColour {
    White = "white",
    Black = "black",
}
class Piece {
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
}

class Queen extends Piece {
    constructor(position: [number, number], colour: ChessColour) {
        super(position, colour);
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

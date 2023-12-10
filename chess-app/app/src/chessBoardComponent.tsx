//fix making first white/black row so they are pushed separately and so they have separate indexes for each piece
import React, {useState} from "react";

import "../App.css";
// "../assets/images/blackPawn.png"
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

//reference point on board with grid inputs
function gridPosition(x: number, y: number): number {
    // Reverse rows from bottom up
    x = 9 - x;
    // Calculate linear position
    return x > 1 ? (8 * x) - 8 + y - 1 : y - 1;
}
function createPawns(colour: string, board: any[], j: number) {
    for (let i = 0; i < horizontalAxis.length; i++) {
        //variables to determine a black or white tile. when adding x and y if the total is even it is a black tile, otherwise it is white
        const number = j + i + 2;
        const isEven = number % 2 === 0;
        const blackOrWhite = isEven ? 'black' : 'white'

        board.push(
            Tile(blackOrWhite, `assets/images/${colour}Pawn.png`)
        );
    }
}

//creates a tile that changes when clicked
function Tile(blackOrWhite: any, img?: string) {
    blackOrWhite = (blackOrWhite === "black") ? "tile black-tile" : "tile white-tile";
    const [tileColour, setTileColour] = useState(blackOrWhite);
    //determine which highlighted colour to show
    const highlightedTile =
        (tileColour === "tile black-tile") ? "tile highlighted-black-tile" :
            (tileColour === "tile white-tile") ? "tile highlighted-white-tile":
                blackOrWhite;
    const handleClick = () => {
        // Change the image source based on your logic
        setTileColour((tileColour === highlightedTile) ? blackOrWhite : highlightedTile);
    };

    if (!img) {
        return <div className={blackOrWhite}></div>
    } else {
        return (
            <div>
                <button className={tileColour} onClick={handleClick}>
                    <img src={img} alt="Chess piece"/>
                </button>
            </div>
        );
    }
};
export default function Chessboard() {
    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        //setup first black row
        if (j === 7) {
            board.push(
                Tile("white","assets/images/blackRook.png"),
                Tile("black","assets/images/blackKnight.png"),
                Tile("white","assets/images/blackBishop.png"),
                Tile("black","assets/images/blackQueen.png"),
                Tile("white","assets/images/blackKing.png"),
                Tile("black","assets/images/blackBishop.png"),
                Tile("white","assets/images/blackKnight.png"),
                Tile("black","assets/images/blackRook.png"),
            );
        }
        //setup second black row
        else if (j === 6) {
            createPawns("black", board, j)
        }
        //setup first white row
        else if (j === 0) {
            board.push(
                <div className="tile black-tile"><img src="assets/images/whiteRook.png"/></div>,
                <div className="tile white-tile"><img src="assets/images/whiteKnight.png"/></div>,
                <div className="tile black-tile"><img src="assets/images/whiteBishop.png"/></div>,
                <div className="tile white-tile"><img src="assets/images/whiteQueen.png"/></div>,
                <div className="tile black-tile"><img src="assets/images/whiteKing.png"/></div>,
                <div className="tile white-tile"><img src="assets/images/whiteBishop.png"/></div>,
                <div className="tile black-tile"><img src="assets/images/whiteKnight.png"/></div>,
                <div className="tile white-tile"><img src="assets/images/whiteRook.png"/></div>,
            );
        }
        //setup second white row
        else if (j === 1) {
            createPawns("white", board, j)
        }
        //setup empty space on board
        else {
            for (let i = 0; i < horizontalAxis.length; i++) {
                const number = j + i + 2;

                if(number % 2 === 0) {
                    board.push(
                        Tile("black")
                    );
                } else {
                    board.push(
                        Tile("white")
                    );
                }
            }
        }
    }

    return <>
        <div id="chessboard">{board}</div>
        <div id="chessboard">{board[gridPosition(8,4)]}</div>
    </>;
}

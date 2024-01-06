import Chessboard from "./Components/Chessboard/chessboard";

function App() {
    return (
        <div id="app">
            <Chessboard/>
        </div>
    )
}

export default App;

import  React, {useEffect, useState} from "react";
import "./chessBoardComponent.css";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface TileProps {
    colour: string;
    img?: string;
    onClick: () => void;
    isHighlighted: boolean;
}

//converts [x, y] co-ordinates to pinpoint tiles in the board array
function gridPosition(x: number, y: number): number {
    const adjustedY = (y - 7) * -1;

    if (adjustedY > 0) {
        return (adjustedY * 8) + x;
    } else {
        return x + adjustedY;
    }
}
function reverseGridPosition(index: number): { x: number; y: number } {
    const adjustedY = Math.floor(index / 8);

    if (adjustedY > 0) {
        return { x: index % 8, y: 7 - adjustedY };
    } else {
        return { x: index % 8, y: 7 + adjustedY };
    }
}


function Tile({ colour, img, onClick, isHighlighted }: TileProps) {
    const baseTileClassName = `tile ${colour}-tile`;
    const validTileClassName = `tile valid-${colour}-tile`;
    const highlightedClassName =`tile highlighted-${colour}-tile`;
    const tileClassName = isHighlighted ? highlightedClassName : baseTileClassName;

    const handleClick = () => {
        onClick();
    };

    if (!img) {
        return (
            <div className={baseTileClassName}>
                <button className="tile valid-tile-button" onClick={handleClick}>
                    <div className={validTileClassName}></div>
                </button>

            </div>
        )
    } else {
        return (
            <div>
                <button className={tileClassName} onClick={handleClick}>
                    <img src={img} alt="chess piece" />
                </button>
            </div>
        );
    }
}

export default function Chessboard() {
    const [highlightedTile, setHighlightedTile] = useState<{ x: number; y: number } | null>(null);
    const [board, setBoard] = useState<JSX.Element[]>([]);
    const createRow = (pieces: string[], colour: string, rowIndex: number): JSX.Element[] => {
        return pieces.map((piece, i) => (
            <Tile
                key={gridPosition(i, rowIndex)}
                colour={(i % 2 === 0) ? colour : (colour === "white" ? "black" : "white")}
                img={`assets/images/${piece}`}
                onClick={() => handleTileClick(i, rowIndex)}
                isHighlighted={highlightedTile && highlightedTile.x === i && highlightedTile.y === rowIndex}
            />
        ));
    };

    const createPawns = (colour: string, rowIndex: number): JSX.Element[] => {
        return horizontalAxis.map((_, i) => (
            <Tile
                key={gridPosition(i, rowIndex)}
                colour={(i % 2 === 0) ? colour : (colour === "white" ? "black" : "white")}
                img={`assets/images/${colour}Pawn.png`}
                onClick={() => handleTileClick(i, rowIndex)}
                isHighlighted={highlightedTile && highlightedTile.x === i && highlightedTile.y === rowIndex}
            />
        ));
    };

    const createEmptyRow = (rowIndex: number): JSX.Element[] => {
        return horizontalAxis.map((_, i) => (
            <Tile
                key={gridPosition(i, rowIndex)}
                colour={(rowIndex + i) % 2 === 0 ? 'black' : 'white'}
                onClick={() => handleTileClick(i, rowIndex)}
                isHighlighted={highlightedTile && highlightedTile.x === i && highlightedTile.y === rowIndex}
            />
        ));
    };

    const handleTileClick = (x: number, y: number) => {
        // Check if the clicked tile is already highlighted
        if (highlightedTile && highlightedTile.x === x && highlightedTile.y === y) {
            // If it is, unhighlight the tile by setting highlightedTile to null
            console.log("1")
            setHighlightedTile(null);
        }
        else {
            // If it's not highlighted, set the clicked tile as highlighted
            if (highlightedTile) {
                if (board[gridPosition(x,y)].props.img) {
                    console.log("2")
                    setHighlightedTile({ x, y });
                } else {
                    console.log("3")
                    movePiece(board, highlightedTile, 0, 16)
                    movePiece(board, highlightedTile, gridPosition(highlightedTile.x, highlightedTile.y), gridPosition(x, y))
                }
            } else {
                console.log('4')
                setHighlightedTile({ x, y });
            }
        }
    };
    function movePiece(board: JSX.Element[], highlightedTile: { x: any; y: any; }, currentTile: number, targetTile: number) {
        const updatedBoard = [...board];

        updatedBoard[updatedBoard[targetTile].key] = <Tile
            key={updatedBoard[targetTile].key}
            colour={updatedBoard[targetTile].props.colour}
            img={updatedBoard[currentTile].props.img}
            onClick={updatedBoard[targetTile].props.onClick}
            isHighlighted={highlightedTile && highlightedTile.x === reverseGridPosition(+updatedBoard[targetTile].key).x && highlightedTile.y === reverseGridPosition(+updatedBoard[targetTile].key).y}
        />

        updatedBoard[updatedBoard[currentTile].key] = <Tile
            key={updatedBoard[currentTile].key}
            colour={updatedBoard[currentTile].props.colour}
            img={null}
            onClick={updatedBoard[currentTile].props.onClick}
            isHighlighted={highlightedTile && highlightedTile.x === reverseGridPosition(+updatedBoard[currentTile].key).x && highlightedTile.y === reverseGridPosition(+updatedBoard[currentTile].key).y}
        />
        console.log("moved piece")
        setBoard(updatedBoard);
    }

    useEffect(() => {
        let newBoard: JSX.Element[] = [];

        for (let j = verticalAxis.length - 1; j >= 0; j--) {
            if (j === 7) {
                newBoard.push(...createRow(['blackRook.png', 'blackKnight.png', 'blackBishop.png', 'blackQueen.png', 'blackKing.png', 'blackBishop.png', 'blackKnight.png', 'blackRook.png'], 'white', j));
            } else if (j === 6) {
                newBoard.push(...createPawns('black', j));
            } else if (j === 0) {
                newBoard.push(...createRow(['whiteRook.png', 'whiteKnight.png', 'whiteBishop.png', 'whiteQueen.png', 'whiteKing.png', 'whiteBishop.png', 'whiteKnight.png', 'whiteRook.png'], 'black', j));
            } else if (j === 1) {
                newBoard.push(...createPawns('white', j));
            } else {
                newBoard.push(...createEmptyRow(j));
            }
        }
        console.log("board refreshed")
        setBoard(newBoard);
    }, [highlightedTile]);

    //movePiece(board, highlightedTile, 0, 20)
    return (
        <>
            <div id="chessboard">{board}</div>
            <div id="chessboard">{highlightedTile ? board[gridPosition(highlightedTile.x, highlightedTile.y)] : 'No Tile Highlighted'}</div>
            <div id="chessboard">{highlightedTile ? [highlightedTile.x, highlightedTile.y] : null}</div>
        </>
    );
}

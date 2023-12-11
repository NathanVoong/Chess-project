import React, { useState } from "react";
import "../App.css";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface TileProps {
    colour: string;
    img?: string;
    onClick: () => void;
    isHighlighted: boolean;
}

function Tile({ colour, img, onClick, isHighlighted }: TileProps) {
    const baseClassName = `tile ${colour}-tile`;
    const highlightedClassName = `tile highlighted-${colour}-tile`;

    const tileClassName = isHighlighted ? highlightedClassName : baseClassName;

    const handleClick = () => {
        onClick();
    };

    if (!img) {
        return <div className={tileClassName}></div>;
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

    const createRow = (pieces: string[], colour: string, rowIndex: number): JSX.Element[] => {
        return pieces.map((piece, i) => (
            <Tile
                key={i}
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
                key={i}
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
                key={i}
                colour={(rowIndex + i) % 2 === 0 ? 'black' : 'white'}
                onClick={() => handleTileClick(i, rowIndex)}
                isHighlighted={highlightedTile && highlightedTile.x === i && highlightedTile.y === rowIndex}
            />
        ));
    };

    const handleTileClick = (x: number, y: number) => {
        setHighlightedTile({ x, y });
    };

    const board: JSX.Element[] = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        if (j === 7) {
            board.push(...createRow(['blackRook.png', 'blackKnight.png', 'blackBishop.png', 'blackQueen.png', 'blackKing.png', 'blackBishop.png', 'blackKnight.png', 'blackRook.png'], 'white', j));
        } else if (j === 6) {
            board.push(...createPawns('black', j));
        } else if (j === 0) {
            board.push(...createRow(['whiteRook.png', 'whiteKnight.png', 'whiteBishop.png', 'whiteQueen.png', 'whiteKing.png', 'whiteBishop.png', 'whiteKnight.png', 'whiteRook.png'], 'black', j));
        } else if (j === 1) {
            board.push(...createPawns('white', j));
        } else {
            board.push(...createEmptyRow(j));
        }
    }

    return (
        <>
            <div id="chessboard">{board}</div>
            <div id="chessboard">{highlightedTile ? `Highlighted Tile: (${highlightedTile.x}, ${highlightedTile.y})` : 'No Tile Highlighted'}</div>
        </>
    );
}

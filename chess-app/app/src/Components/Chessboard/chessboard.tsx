import "./Chessboard.css";
import Tile from "../Tile/tile";
import { MouseEvent, useEffect, useRef, useState } from "react";
import {act} from "react-dom/test-utils";
import {set} from "yaml/dist/schema/yaml-1.1/set";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
    image: string;
    x: number;
    y: number;
}

const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
    const type = (p === 0) ? "black" : "white";
    const y = (p === 0) ? 7 : 0;

    initialBoardState.push({ image: `assets/images/${type}Rook.png`, x: 0, y });
    initialBoardState.push({ image: `assets/images/${type}Rook.png`, x: 7, y });
    initialBoardState.push({
        image: `assets/images/${type}Knight.png`,
        x: 1,
        y,
    });
    initialBoardState.push({
        image: `assets/images/${type}Knight.png`,
        x: 6,
        y,
    });
    initialBoardState.push({
        image: `assets/images/${type}Bishop.png`,
        x: 2,
        y,
    });
    initialBoardState.push({
        image: `assets/images/${type}Bishop.png`,
        x: 5,
        y,
    });
    initialBoardState.push({ image: `assets/images/${type}Queen.png`, x: 3, y });
    initialBoardState.push({ image: `assets/images/${type}King.png`, x: 4, y });
}

for (let i = 0; i < 8; i++) {
    initialBoardState.push({ image: "assets/images/blackPawn.png", x: i, y: 6 });
}

for (let i = 0; i < 8; i++) {
    initialBoardState.push({ image: "assets/images/whitePawn.png", x: i, y: 1 });
}

export default function Chessboard () {
    const[activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLElement>(null);

    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 80));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / 80)));
            const x = e.clientX - 38;
            const y = e.clientY - 38;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft;
            const minY = chessboard.offsetTop;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 80;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 80;
            const x = e.clientX - 40;
            const y = e.clientY - 40;
            activePiece.style.position = "absolute";

            if (x < minX) {
                activePiece.style.left = `${minX}px`
            }
            else if (x > maxX) {
                activePiece.style.left = `${maxX}px`
            }
            else {
                activePiece.style.left = `${x}px`
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`
            }
            else if (y > maxY) {
                activePiece.style.top = `${maxY}px`
            }
            else {
                activePiece.style.top = `${y}px`
            }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 80);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / 80));
            console.log(x, y)
            console.log(gridX, gridY)
            setPieces((value) => {
                const pieces = value.map((p) => {
                    if (p.x === gridX && p.y === gridY) {
                        p.x = x;
                        p.y = y;
                    }
                    return p;
                });
                return pieces;
            });
            setActivePiece(null);
        }
    }

    let board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image = undefined;

            pieces.forEach(p => {
                if (p.x === i && p.y === j) {
                    image = p.image
                }
            })

            board.push(<Tile key={`${j},${i}`}image={image} number={number}/>)
        }
    }

    return (
        <div
            onMouseMove={(e) => movePiece(e)}
            onMouseDown={e => grabPiece(e)}
            onMouseUp={(e) => dropPiece(e)}
            id="chessboard"
            ref={chessboardRef}
        >
            {board}
        </div>
    );
}

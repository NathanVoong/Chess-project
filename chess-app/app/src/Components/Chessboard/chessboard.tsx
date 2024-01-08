import "./Chessboard.css";
import Tile from "../Tile/tile";
import {useRef, useState} from "react";
import {
    VERTICAL_AXIS,
    HORIZONTAL_AXIS,
    GRID_SIZE,
} from "../../Constants";
import {Piece, Position} from "../../models";

// Props interface for Chessboard component
interface Props {
    playMove: (piece: Piece, position: Position) => boolean;
    pieces: Piece[];
}

// Chessboard component responsible for rendering the chessboard and handling piece movement
export default function Chessboard({playMove, pieces}: Props) {
    // State variables
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
    const chessboardRef = useRef<HTMLElement>(null);
    const [showMenu, setShowMenu] = useState(false);

    // Function to handle grabbing a chess piece
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;

        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE));
            setGrabPosition(new Position(grabX, grabY));

            // Set initial position for the dragged piece
            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    // Function to handle moving a chess piece
    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;

        if (activePiece && chessboard) {
            // Define the boundaries for piece movement within the chessboard
            const minX = chessboard.offsetLeft;
            const minY = chessboard.offsetTop;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 80;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 80;

            // Calculate the new position of the dragged piece
            const x = e.clientX - 40;
            const y = e.clientY - 40;
            activePiece.style.position = "absolute";

            // Ensure the piece stays within the defined boundaries
            if (x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    // Function to handle dropping a chess piece
    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;

        if (activePiece && chessboard) {
            // Calculate the grid position where the piece is dropped
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE));

            // Find the piece currently at the grab position
            const currentPiece = pieces.find(p => p.samePosition(grabPosition));

            if (currentPiece) {
                // Attempt to play the move and handle the result
                let success = playMove(currentPiece.clone(), new Position(x, y));

                if (!success) {
                    // Reset the piece position if the move is not valid
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }
            setActivePiece(null);
        }
    }

    // Array to store the tiles of the chessboard
    let board = [];

    // Loop through rows and columns to create tiles
    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find(p => p.samePosition(new Position(i, j)));

            // Determine image and highlight status for the current tile
            let image = piece ? piece.image : undefined;
            let currentPiece =
                activePiece != null
                    ? pieces.find(p => p.samePosition(grabPosition))
                    : undefined;
            let highlight =
                currentPiece?.possibleMoves ?
                    currentPiece.possibleMoves.some(p =>
                        p.samePosition(new Position(i, j))
                    ) :
                    false;

            // Add a Tile component to the board array
            board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight}/>);
        }
    }

    // Return the Chessboard component with event handlers
    return (
        <>
            <div
                onMouseMove={(e) => movePiece(e)}
                onMouseDown={(e) => grabPiece(e)}
                onMouseUp={(e) => dropPiece(e)}
                id="chessboard"
                ref={chessboardRef}
            >
                {board}
            </div>
        </>
    );
}

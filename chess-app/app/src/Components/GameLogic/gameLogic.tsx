import {useEffect, useRef, useState} from "react";
import {initialBoard} from "../../Constants";
import {Piece, Position} from "../../models";
import {Board} from "../../models/Board";
import {Pawn} from "../../models/Pawn";
import {
    bishopMove,
    getPossibleBishopMoves,
    getPossibleKingMoves,
    getPossibleKnightMoves,
    getPossiblePawnMoves,
    getPossibleQueenMoves,
    getPossibleRookMoves,
    kingMove,
    knightMove,
    pawnMove,
    queenMove,
    rookMove
} from "../../PieceRules/rules";
import {PieceType, TeamType} from "../../Types";
import Chessboard from "../Chessboard/chessboard";
import Menu from "../Menu/menu";

// The main component for handling game logic
export default function GameLogic() {
    // State variables
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const [showMenu, setShowMenu] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);

    // Function to go back to the main menu
    const backButton = () => {
        setShowMenu(!showMenu);
        setBoard(initialBoard.clone());
    };

    // Function to handle the playing of a move
    function playMove(playedPiece: Piece, destination: Position): boolean {
        // If the playing piece doesn't have any moves, return false
        if (playedPiece.possibleMoves === undefined) return false;

        // Prevent the inactive team from playing
        if (
            (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 1) ||
            (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 0)
        )
            return false;

        let playedMoveIsValid = false;

        // Check if the destination is a valid move for the played piece
        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

        if (!validMove) return false;

        // Check for en passant move
        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );

        // playMove modifies the board, so we use setBoard to update the state
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            // Playing the move
            playedMoveIsValid = clonedBoard.playMove(
                enPassantMove,
                validMove,
                playedPiece,
                destination
            );
            // Display checkmate modal if applicable
            if (clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
            }

            return clonedBoard;
        });

        // Check if a pawn needs to be promoted
        let promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(previousPromotionPawn => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }
        return playedMoveIsValid;
    }

    // Function to check if the move is an en passant move
    function isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType
    ) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if (
                (desiredPosition.x - initialPosition.x === -1 ||
                    desiredPosition.x - initialPosition.x === 1) &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                const piece = board.pieces.find(
                    p =>
                        p.position.x === desiredPosition.x &&
                        p.position.y === desiredPosition.y - pawnDirection &&
                        p.isPawn &&
                        (p as Pawn).enPassant
                );
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }

    // Function to check if a move is valid for a given piece type
    function isValidMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType
    ) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
        }

        return validMove;
    }

    // Function to promote a pawn to a specified piece type
    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        setBoard(previousBoard => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(
                        new Piece(
                            piece.position.clone(),
                            pieceType,
                            piece.team,
                            true
                        )
                    );
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);
            clonedBoard.calculateAllMoves();

            return clonedBoard;
        });

        modalRef.current?.classList.add("hidden");
    }

    // Function to determine the team type for pawn promotion
    function promotionTeamType() {
        return promotionPawn?.team === TeamType.OUR ? "white" : "black";
    }

    // Function to restart the game
    function restartGame() {
        checkmateModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }

    // Conditional rendering based on whether to show the menu or the game board
    if (showMenu) {
        return <Menu toggleMenu={() => setShowMenu(!showMenu)}/>;
    } else {
        return (
            <>
                {/* Button to go back to the main menu */}
                <button className="backButton" onClick={backButton}>
                    Back
                </button>
                {/* Display the current move count */}
                <p
                    style={{
                        color: "Black",
                        fontSize: "24px",
                        textAlign: "center"
                    }}
                >
                    Move: {Math.round(board.totalTurns / 2)}
                </p>
                {/* Modal for pawn promotion options */}
                <div className="modal hidden" ref={modalRef}>
                    <div className="modal-body">
                        <img
                            onClick={() => promotePawn(PieceType.ROOK)}
                            src={`/assets/images/${promotionTeamType()}Rook.png`}
                        />
                        <img
                            onClick={() => promotePawn(PieceType.BISHOP)}
                            src={`/assets/images/${promotionTeamType()}Bishop.png`}
                        />
                        <img
                            onClick={() => promotePawn(PieceType.KNIGHT)}
                            src={`/assets/images/${promotionTeamType()}Knight.png`}
                        />
                        <img
                            onClick={() => promotePawn(PieceType.QUEEN)}
                            src={`/assets/images/${promotionTeamType()}Queen.png`}
                        />
                    </div>
                </div>
                {/* Modal for displaying checkmate */}
                <div className="modal hidden" ref={checkmateModalRef}>
                    <div className="modal-body">
                        <div className="checkmate-body">
                            <span>
                                The winning team is{" "}
                                {board.winningTeam === TeamType.OUR ? "white" : "black"}!
                            </span>
                            <button onClick={restartGame}>Play again</button>
                        </div>
                    </div>
                </div>
                {/* Render the chessboard component */}
                <Chessboard playMove={playMove} pieces={board.pieces}/>
            </>
        );
    }
}

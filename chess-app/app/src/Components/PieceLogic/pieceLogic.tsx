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

export default function PieceLogic() {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updatePossibleMoves();
    }, []);

    function updatePossibleMoves() {
        board.calculateAllMoves();
    }

    function playMove(playedPiece: Piece, destination: Position): boolean {
        let playedMoveIsValid = false;

        const validMove = isValidMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );

        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );

        // playMove modifies the board thus we
        // need to call setBoard
        setBoard((previousBoard) => {
            // Playing the move
            playedMoveIsValid = board.playMove(enPassantMove,
                validMove, playedPiece,
                destination);

            return board.clone();
        })

        // This is for promoting a pawn
        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;
        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(playedPiece);
        }
        return playedMoveIsValid;
    }

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
                    (p) =>
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

    //TODO
    //Pawn promotion
    //Prevent the king from moving into danger
    //Add castling
    //Add check
    //Add checkmate
    //Add stalemate
    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
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

    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        board.pieces = board.pieces.reduce((results, piece) => {
            if (piece.samePiecePosition(promotionPawn)) {
                piece.type = pieceType;
                const teamType = (piece.team === TeamType.OUR) ? "white" : "black";
                let image = "";
                switch (pieceType) {
                    case PieceType.ROOK: {
                        image = "Rook";
                        break;
                    }
                    case PieceType.BISHOP: {
                        image = "Bishop";
                        break;
                    }
                    case PieceType.KNIGHT: {
                        image = "Knight";
                        break;
                    }
                    case PieceType.QUEEN: {
                        image = "Queen";
                        break;
                    }
                }
                piece.image = `assets/images/${teamType}${image}.png`;
            }
            results.push(piece);
            return results;
        }, [] as Piece[])
        updatePossibleMoves();

        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "white" : "black";
    }

    return (
        <>
            <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)}
                         src={`/assets/images/${promotionTeamType()}Rook.png`}/>
                    <img onClick={() => promotePawn(PieceType.BISHOP)}
                         src={`/assets/images/${promotionTeamType()}Bishop.png`}/>
                    <img onClick={() => promotePawn(PieceType.KNIGHT)}
                         src={`/assets/images/${promotionTeamType()}Knight.png`}/>
                    <img onClick={() => promotePawn(PieceType.QUEEN)}
                         src={`/assets/images/${promotionTeamType()}Queen.png`}/>
                </div>
            </div>
            <Chessboard playMove={playMove} pieces={board.pieces}/>
        </>
    )
}

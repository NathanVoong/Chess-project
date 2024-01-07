import "./Chessboard.css";
import Tile from "../Tile/tile";
import {useRef, useState} from "react";
import PieceLogic from "../../PieceLogic/pieceLogic";
import {
    VERTICAL_AXIS,
    HORIZONTAL_AXIS,
    GRID_SIZE,
    Piece,
    PieceType,
    TeamType,
    initialBoardState,
    Position,
    samePosition,
} from "../../Constants";

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1});
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const pieceLogic = new PieceLogic();

    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement
        const chessboard = chessboardRef.current;
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE));
            setGrabPosition({x: grabX, y: grabY});
            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
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
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`
            } else {
                activePiece.style.left = `${x}px`
            }

            if (y < minY) {
                activePiece.style.top = `${minY}px`
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`
            } else {
                activePiece.style.top = `${y}px`
            }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE));
            const currentPiece = pieces.find((p) => samePosition(p.position, grabPosition));

            if (currentPiece) {
                const validMove = pieceLogic.isValidMove(
                    grabPosition,
                    {x, y},
                    currentPiece.type,
                    currentPiece.team,
                    pieces
                );

                const isEnPassantMove = pieceLogic.isEnPassantMove(
                    grabPosition,
                    {x, y},
                    currentPiece.type,
                    currentPiece.team,
                    pieces
                );

                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

                if (isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if (
                            !samePosition(piece.position, {x, y: y - pawnDirection})
                        ) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }

                        return results;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);
                } else if (validMove) {
                    //UPDATES THE PIECE POSITION
                    //AND IF A PIECE IS ATTACKED, REMOVES IT
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            //SPECIAL MOVE
                            piece.enPassant =
                                Math.abs(grabPosition.y - y) === 2 &&
                                piece.type === PieceType.PAWN;

                            piece.position.x = x;
                            piece.position.y = y;

                            let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;

                            if(y === promotionRow && piece.type === PieceType.PAWN) {
                                modalRef.current?.classList.remove("hidden");
                                setPromotionPawn(piece);
                            }
                            results.push(piece);
                        } else if (!samePosition(piece.position, {x, y})) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }

                        return results;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);
                } else {
                    //RESETS THE PIECE POSITION
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("top");
                    activePiece.style.removeProperty("left");
                }
            }
            setActivePiece(null);
        }
    }

    function promotePawn(pieceType: PieceType) {
        if(promotionPawn === undefined) {
            return;
        }

        const updatedPieces = pieces.reduce((results, piece) => {
            if(samePosition(piece.position, promotionPawn.position)) {
                piece.type = pieceType;
                const teamType = (piece.team === TeamType.OUR) ? "white" : "black";
                let image = "";
                switch(pieceType) {
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

        setPieces(updatedPieces);

        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "white" : "black";
    }

    let board = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const number = j + i + 2;
            const piece = pieces.find((p) =>
                samePosition(p.position, {x: i, y: j})
            );
            let image = piece ? piece.image : undefined;

            board.push(<Tile key={`${j},${i}`} image={image} number={number}/>)
        }
    }

    // @ts-ignore
    return (
        <>
            <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/${promotionTeamType()}Rook.png`}/>
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/${promotionTeamType()}Bishop.png`}/>
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/${promotionTeamType()}Knight.png`}/>
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/${promotionTeamType()}Queen.png`}/>
                </div>
            </div>
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

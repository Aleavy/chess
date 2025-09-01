import { Pawn } from "./modules/pieces.js";
import { Board, PieceBoard } from "./modules/boards.js";

const canvas = document.getElementById("canvas");
const canvasPiece = document.getElementById("canvas-pieces");
const ctxPiece = canvasPiece.getContext("2d");
const ctx = canvas.getContext("2d");

const board = new Board(ctx, canvas);
const pieceBoard = new PieceBoard(ctxPiece, canvasPiece, board.ctx);
const wPawn = new Pawn("w", 1, 1, pieceBoard.ctx);
const w2Pawn = new Pawn("w", 1, 7, pieceBoard.ctx);
// const w3Pawn = new Pawn("w", 2, 7, pieceBoard.ctx);
const w4Pawn = new Pawn("w", 3, 7, pieceBoard.ctx);
const bPawn = new Pawn("f", 2, 8, ctxPiece);
pieceBoard.addPiece(bPawn);
pieceBoard.addPiece(wPawn);
pieceBoard.addPiece(w2Pawn);
// pieceBoard.addPiece(w3Pawn);
pieceBoard.addPiece(w4Pawn);
board.draw();
pieceBoard.draw();

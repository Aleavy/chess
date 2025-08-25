import { Pawn } from "./modules/pieces.js";
import { Board, PieceBoard } from "./modules/boards.js";

const canvas = document.getElementById("canvas");
const canvasPiece = document.getElementById("canvas-pieces");
const ctxPiece = canvasPiece.getContext("2d");
const ctx = canvas.getContext("2d");

const board = new Board(ctx, canvas);
const pieceBoard = new PieceBoard(ctxPiece, canvasPiece);
const pawn = new Pawn("s", 50, 400, pieceBoard.ctx);
pieceBoard.addPiece(pawn);
board.draw();
pieceBoard.draw();

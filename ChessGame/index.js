const canvas = document.getElementById("canvas");
const canvasPiece = document.getElementById("canvas-pieces");
const ctxPiece = canvasPiece.getContext("2d");
const ctx = canvas.getContext("2d");
const whiteTileColor = "#ffffff";
const brownTileColor = "#5a280f";
const dataLog = document.getElementById("data");

dataLog.innerText = `W- ${canvas.width} H- ${canvas.height}`;

class Board {
  constructor(contex, canvas) {
    this.ctx = contex;
    this.height = canvas.height;
    this.width = canvas.width;
    this.canvas = canvas;
    this.setHeight(400);
    this.setWidth(400);
  }

  setHeight(height) {
    this.canvas.height = height;
    this.height = height;
  }

  setWidth(width) {
    this.canvas.width = width;
    this.width = width;
  }

  draw() {
    for (let j = 0; j < 9; j++) {
      const y = j * 50;
      for (let x = 0; x <= this.canvas.width; x += 50) {
        this.ctx.fillStyle =
          this.ctx.fillStyle === whiteTileColor
            ? brownTileColor
            : whiteTileColor;
        this.ctx.fillRect(x, y, 50, 50);
      }
    }
  }

  drawGrid() {
    for (let x = 25; x <= this.height; x += 25) {
      this.ctx.strokeRect(0, x, 400, 0);
      this.ctx.strokeRect(x, 0, 0, 400);
    }
  }
}

class PieceBoard extends Board {
  constructor(context, canvas) {
    super(context, canvas);
    this.pieces = [];
    this.ctx.translate(10, 20);
  }

  draw() {
    for (let piece of this.pieces) {
      piece.img.onload = () => {
        this.ctx.drawImage(
          piece.img,
          0,
          0,
          360,
          360,
          piece.positionX.start,
          piece.positionY.start,
          30,
          30
        );
        console.log("Drawed: ", piece);
      };
    }
  }

  addPiece(piece) {
    this.pieces.push(piece);
  }
}

class Piece {
  tileDistance = 50;
  constructor(color, x, y) {
    this.color = color;
    this.positionX = { start: x - 50, end: x };
    this.positionY = { start: y - 50, end: y };
  }
}

class Pawn extends Piece {
  img = new Image();
  constructor(color, x, y, context) {
    super(color, x, y);
    this.ctx = context;
    this.team = this.color === "white" ? "white-pawn.webp" : "test";
    this.img.src = this.team;
  }

  move(tiles) {
    return;
  }
}

const board = new Board(ctx, canvas);
const pieceBoard = new PieceBoard(ctxPiece, canvasPiece);
const pawn = new Pawn("white", 50, 50, pieceBoard.ctx);
pieceBoard.addPiece(pawn);
board.draw();
pieceBoard.draw();

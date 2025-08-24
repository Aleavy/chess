const whiteTileColor = "#ffffff";
const brownTileColor = "#5a280f";
const dataLog = document.getElementById("data");

dataLog.innerText = `W- ${canvas.width} H- ${canvas.height}`;

class Board {
  tileDistance = 50;
  constructor(context, canvas) {
    this.ctx = context;
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
    this.canvas.addEventListener("mousemove", (e) => this.trackMouse(e));
    this.canvas.addEventListener("mousedown", (e) => {
      this.trackMouse(e);
    });
    this.canvas.addEventListener("mouseup", (e) => {
      this.mousePiece(e);
    });
  }

  mousePiece(e) {
    console.log(e.offsetY);
    const tilesY = Math.floor(e.offsetY / this.tileDistance);
    const tilesX = Math.floor(e.offsetX / this.tileDistance);
    const piece = this.filterPiece(tilesX, tilesY);
    piece.move(tilesY);
  }

  filterPiece(cordX, cordY) {
    return this.pieces.filter((piece) => {
      piece.positionX.start <= cordX &&
        cordX <= piece.positionX.end &&
        piece.positionY.start <= cordY &&
        cordY <= piece.positionY.end;
      return piece;
    })[0];
  }

  trackMouse(e) {
    const Y = e.offsetY;
    const X = e.offsetX;
    dataLog.innerText = `Y-${Y} X-${X}`;
  }

  draw() {
    for (let piece of this.pieces) {
      piece.img.onload = () => {
        this.ctx.drawImage(
          piece.img,
          0,
          0,
          piece.img.naturalWidth,
          piece.img.naturalHeight,
          piece.positionX.start,
          piece.positionY.start,
          50,
          50
        );
        console.log("Drawed: ", piece);
      };
    }
  }

  addPiece(piece) {
    this.pieces.push(piece);
  }
}

export { Board, PieceBoard };

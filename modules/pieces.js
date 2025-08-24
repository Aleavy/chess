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
    this.team = this.color === "w" ? "white" : "black";
    this.direction = this.team === "white" ? "down" : "up";
    this.img.src = this.team === "white" ? "white-pawn.webp" : "dark-pawn.webp";
  }

  isInSamePosition(cordY) {
    return this.positionY.start === cordY;
  }

  move(cordY) {
    const moveTiles = cordY * this.tileDistance;
    if (this.isInSamePosition(moveTiles)) return;
    console.log("moving", moveTiles);
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.img.naturalWidth,
      this.img.naturalHeight,
      this.positionX.start,
      moveTiles,
      50,
      50
    );
  }
}

export { Piece, Pawn };

class Piece {
  tileDistance = 50;
  constructor(color, xTile, yTile) {
    this.color = color;
    this.team = this.color === "w" ? "white" : "black";
    xTile = xTile * this.tileDistance;
    yTile = yTile * this.tileDistance;
    this.validMoves = [];
    this.position = {x: xTile, y:yTile };
  }
}

class Pawn extends Piece {
  img = new Image();
  constructor(color, x, y, context) {
    super(color, x, y);
    this.ctx = context;
    this.board = context.canvas
    this.nearEnemys = [];
    this.hasMoved = false;
    this.limitTiles = 2;
    this.direction = this.team === "white" ? "down" : "up";
    this.img.src = this.team === "white" ? "white-pawn.webp" : "dark-pawn.webp";
  }

  isInSamePosition(cordY, cordX) {
    return this.position.y === cordY && cordX == this.position.x;
  }

  deleteThisPieceOnCanvas() {
    this.ctx.clearRect(
      this.position.x - this.tileDistance,
      this.position.y - this.tileDistance,
      this.tileDistance,
      this.tileDistance
    );
  }

  deletePieceEaten(cordY, cordX){
    this.ctx.clearRect(
      cordX - this.tileDistance,
      cordY - this.tileDistance,
      this.tileDistance,
      this.tileDistance
    );

    const event = new CustomEvent("piece-was-eat", {detail:{x: cordX, y:cordY}})
    this.board.dispatchEvent(event)
  }

  updateCords(cordY = null, cordX = null) {
    console.log("BEFORE UPDATE: ",this.position);
    let y, x;

    if (cordY === null) {
      y = this.position.y;
    } else {
      y = cordY;
    }
    if (cordX === null) {
      x = this.position.x;
    } else {
      x = cordX;
    }

    this.position.x = x;
    this.position.y = y;
    console.log("AFTER UPDATE: ",this);
  }

  isMovingInRigthDirection(moveTiles) {
    switch (this.direction) {
      case "up":
        return moveTiles < this.position.y;

      case "down":
        return moveTiles > this.position.y;
    }
  }

  // moveIsInLimit(moveTiles) {
  //   switch (this.direction) {
  //     case "up":
  //       if (this.hasMoved) {
  //         return moveTiles === this.positionY.start - this.tileDistance;
  //       } else {
  //         return (
  //           moveTiles === this.positionY.start - this.tileDistance * 2 ||
  //           moveTiles === this.positionY.start - this.tileDistance
  //         );
  //       }
  //     case "down":
  //       if (this.hasMoved) {
  //         return moveTiles === this.positionY.start + this.tileDistance;
  //       } else {
  //         return (
  //           moveTiles === this.positionY.start + this.tileDistance * 2 ||
  //           moveTiles === this.positionY.start + this.tileDistance
  //         );
  //       }
  //   }
  // }



  cordsEnemyPiece() {
    console.log(this.direction);
    let y;
    if (this.direction === "down") {
      y = this.position.y + this.tileDistance;
    } else {
      y = this.position.y - this.tileDistance;
    }
    const xRigth = this.position.x + this.tileDistance;
    const xLeft = this.position.x - this.tileDistance;
    console.log(
      "cords of enemys pawn: ",
      { cords: { x: xRigth, y } },
      { cords: { x: xLeft, y } }
    );
    return [{ cords: { x: xRigth, y } }, 
            { cords: { x: xLeft, y } }
          ];
  }

  move(cordY, cordX) {
    if (this.isInSamePosition(cordY, cordX)) return;
    if (!this.isMovingInRigthDirection(cordY)) return;
    console.log("moving", cordY);

    this.deleteThisPieceOnCanvas();
    if(this.position.x !== cordX){
      this.deletePieceEaten(cordY=cordY, cordX=cordX)
    }
    console.log("POSITIONS X: ",this.position.x, cordX)
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.img.naturalWidth,
      this.img.naturalHeight,
      cordX - this.tileDistance,
      cordY - this.tileDistance,
      this.tileDistance,
      this.tileDistance
    );
    if (!this.hasMoved) {
      this.hasMoved = true;
      this.limitTiles = 1;
    }
    this.updateCords(cordY=cordY, cordX=cordX);
  }
}

export { Piece, Pawn };

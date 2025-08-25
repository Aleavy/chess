class Piece {
  tileDistance = 50;
  constructor(color, x, y) {
    this.color = color;
    this.team = this.color === "w" ? "white" : "black";
    this.positionX = { start: x - 50, end: x };
    this.positionY = { start: y - 50, end: y };
  }
}

class Pawn extends Piece {
  img = new Image();
  constructor(color, x, y, context) {
    super(color, x, y);
    this.ctx = context;
    this.hasMoved = false;
    this.limitTiles = 2
    this.direction = this.team === "white" ? "down" : "up";
    this.img.src = this.team === "white" ? "white-pawn.webp" : "dark-pawn.webp";
  }

  isInSamePosition(cordY) {
    return this.positionY.start === cordY;
  }

  deletePieceOnCanvas(){
    this.ctx.clearRect(this.positionX.start, this.positionY.start, 50, 50)
  }

  updateCords(cordY=null, cordX=null){
    let y, x;
    
    if (cordY === null){
      y = this.positionY.start
    }else{
      y= cordY
    }
    if(cordX === null){
      x = this.positionX.start
    }else{
      x=cordX
    }

    this.positionX.start = x
    this.positionX.end = x + this.tileDistance
    this.positionY.start = y
    this.positionY.end = y + this.tileDistance
    console.log(this)
  }

  isMovingInRigthDirection(moveTiles){
    switch (this.direction) {
      case 'up':
        return moveTiles < this.positionY.start
        
      case 'down':
        return moveTiles > this.positionY.start
    }
  }

  moveIsInLimit(moveTiles){
    switch (this.direction){
      case 'up':
        if (this.hasMoved){
          return moveTiles === this.positionY.start - this.tileDistance
        }else{
          return moveTiles === this.positionY.start - (this.tileDistance * 2) || moveTiles === this.positionY.start - this.tileDistance 
        }
      case 'down':
        if (this.hasMoved){
          return moveTiles === this.positionY.start + this.tileDistance
        }else{
          return moveTiles === this.positionY.start + (this.tileDistance * 2) || moveTiles === this.positionY.start + this.tileDistance
      } 
  }
}

  move(cordY) {
    const moveTiles = cordY * this.tileDistance;
    if (this.isInSamePosition(moveTiles)) return;
    if(!this.isMovingInRigthDirection(moveTiles))return;  
    if (!this.moveIsInLimit(moveTiles))return;
    console.log("moving", moveTiles);

    this.deletePieceOnCanvas()
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
    if (!this.hasMoved){
      this.hasMoved = true;
      this.limitTiles = 1
      }
    this.updateCords(cordY=moveTiles)
  }
}

export { Piece, Pawn };

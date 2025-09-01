const whiteTileColor = "#ffffff";
const brownTileColor = "#5a280f";
const greenTileColor = "#74c476";
const dataLog = document.getElementById("data");

dataLog.innerText = `W- ${canvas.width} H- ${canvas.height}`;


class History{
    tileDistance = 50;

  constructor(prev,  context){
    this.prev = prev
    this.context = context
  }


  drawWhileMoving(event, piece){
    console.log("dRAWW")
    if(this.prev === null){
      this.prev = {x:event.offsetX - (this.tileDistance/2),
      y:event.offsetY- (this.tileDistance/2)}}
    else{
      this.context.clearRect(this.prev.x, this.prev.y, 50, 50)
      this.context.drawImage(
          piece.img,
          0,
          0,
          piece.img.naturalWidth,
          piece.img.naturalHeight,
          event.offsetX - (this.tileDistance/2),
          event.offsetY- (this.tileDistance/2),
          this.tileDistance,
          this.tileDistance
        );
      this.prev = {x:event.offsetX - (this.tileDistance/2),
      y:event.offsetY- (this.tileDistance/2)}}
  }
}


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
  constructor(context, canvas, tilesBoardContext) {
    super(context, canvas);
    this.pieces = [];
    this.tilesBoardContext = tilesBoardContext
    this.history = new History(null, context)
    this.current_piece = null;
    this.canvas.addEventListener("mousemove", (e) => {
      this.trackMouse(e);
      if(this.current_piece){
        this.history.drawWhileMoving(e, this.current_piece)

      }

      }
    );
    this.canvas.addEventListener("mousedown", (e) => {
      let {moveTilesX, moveTilesY} = this.calculateTilesDistance(e)
      const cords = { y: moveTilesY, x: moveTilesX };
      this.current_piece = this.selectPiece(cords);
      if (this.current_piece){
        
        const enemyPieces = this.selectPieces(
          this.current_piece.cordsEnemyPiece()
        );
        this.current_piece.nearEnemies = enemyPieces
        this.setValidMoves(this.current_piece)
        this.showValidMoves(this.current_piece)

        console.log(this.current_piece.nearEnemies)
      }
    });
    this.canvas.addEventListener("piece-was-eat", (e)=>{
      const pieceEaten = this.selectPiece({x : e.detail.x, y: e.detail.y})
      this.pieces = this.pieces.filter((piece) => piece !== pieceEaten)
    })
    this.canvas.addEventListener("mouseup", (e) => {

      let {moveTilesX, moveTilesY} = this.calculateTilesDistance(e)
      if (this.current_piece) {
        // console.log(this.current_piece.nearEnemies)
        // console.log("near enemies: ", this.nearEnemies)

        console.log("VALID MOVES", this.current_piece.validMoves)
        if(this.checkValidMoves(moveTilesY, moveTilesX, this.current_piece)){
          this.current_piece.move(moveTilesY, moveTilesX);
          console.log("PIECES CURRENT: ", this.pieces)
          ;
        }

        this.current_piece = null
      }
    });
  }

  showValidMoves(piece){
    for (const move of piece.validMoves){
      this.tilesBoardContext.fillStyle = greenTileColor
      console.log("MOVE: ",move)
      this.tilesBoardContext.fillRect(move.x - this.tileDistance, move.y - this.tileDistance, this.tileDistance, this.tileDistance)
    }

  }



  calculateTilesDistance(e){
    const tilesY = Math.floor((e.offsetY+ this.tileDistance) / this.tileDistance);
    const tilesX = Math.floor((e.offsetX + this.tileDistance) / this.tileDistance);
    console.log("TILES: ", tilesX, tilesY)
    const moveTilesY = tilesY * this.tileDistance;
    const moveTilesX = tilesX * this.tileDistance;
    return {moveTilesX, moveTilesY}
  }

  setValidMoves(piece){
    let limit = piece.limitTiles
    const cords = []
    const frontPieces = []
    if (piece.nearEnemies?.length > 0){
      piece.nearEnemies.forEach(piece => {
        let enemyCord = {x: piece.position.x, y: piece.position.y}
        cords.push(enemyCord)
      });
    }
    if (piece.direction === "up"){
      for (limit; limit > 0 ; limit--){
        const y = piece.position.y - (limit * piece.tileDistance)
        const cord = {x: piece.position.x, y}
        if(this.checkFrontPiece(cord)){
          frontPieces.push(cord)
        }else if (cord.x < frontPieces[0]?.x ){
          continue
        }else{
          cords.push(cord)
        }
      }
    }else{
      for (limit; limit > 0 ; limit--){
        const y = piece.position.y + (limit * piece.tileDistance)
        const cord = {x: piece.position.x, y}
        if(this.checkFrontPiece(cord)){
          frontPieces.push(cord)
        }else if (frontPieces && cord.x > frontPieces[0]?.x ){
          continue
        }else{
          cords.push(cord)
        }
      }
    }
    piece.validMoves = cords
  }

  checkValidMoves(cordY, cordX, piece){
    let valid = false;
    for (let cord of piece.validMoves){
      console.log("XY", cord)
      console.log("cordsyx: ", cordX, cordY)
      if (cordX === cord.x && cordY === cord.y) {
        valid = true
      };
    }
    return valid;
  }


  checkFrontPiece(cords){
    return this.pieces.find((piece)=> piece.position.x === cords.x && piece.position.y == cords.y)
  }

  selectPieces(cordsArgs) {
    const selectedPieces = [];
    for (const arg of cordsArgs) {
      console.log("args", arg);
      const piece = this.filterPiece(arg.cords.x, arg.cords.y);
      console.log("current piece: ", piece);
      if (piece.length > 0) {
        selectedPieces.push(piece[0]);
      }
    }
    console.log("selected pieces: ", selectedPieces);
    return selectedPieces;
  }

  selectPiece(cordsArg) {
    console.log("Piecesarg", cordsArg)
    const pieces = this.filterPiece(cordsArg.x, cordsArg.y);
    return pieces[0];
  }


  filterPiece(cordX, cordY) {
    console.log(cordX, cordY);
    const pieces = this.pieces.filter((piece) => {
      if (
        piece.position.x === cordX &&
        piece.position.y === cordY
      )
        return piece;
    });

    return pieces;
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
          piece.position.x - this.tileDistance,
          piece.position.y - this.tileDistance,
          this.tileDistance,
          this.tileDistance
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

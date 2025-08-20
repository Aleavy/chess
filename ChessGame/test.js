const canvas = document.getElementById("canvas");
const canvasTest = document.getElementById("test");
canvas.width = 400;
canvas.height = 400;
canvasTest.width = 200;
canvasTest.height = 200;
canvasTest.style = "border : 4px solid red; background-color : yellow;";
const ctx = canvasTest.getContext("2d");
const whiteTileColor = "#ffffff";
const brownTileColor = "#5a280f";
const dataLog = document.getElementById("data");

const img = new Image();
img.src = "knight.jpg";

img.onload = () => {
  dataLog.innerText = `img: w-${img.width} h-${img.height} json-${img}`;
  ctx.drawImage(img, //draw stretched
      0,0,66,66, //source (x,y,w,h)
      100,0,100,100//destination (x,y,w,h)
      );
};

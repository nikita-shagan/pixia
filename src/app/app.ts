import * as PIXI from "pixi.js-legacy";
import SkiaWrapper from "../services/skia/skia-wrapper";
import "./app.css";
import lights from "../assets/1.png";
import CanvasKitInit from "skia";
import downloadPDF from "../utils/download-pdf";

const pixiApp = new PIXI.Application<HTMLCanvasElement>({
  width: 500,
  height: 400,
  resolution: 1,
  forceCanvas: true,
});
document.getElementById("app")?.appendChild(pixiApp.view);

const mainContainer = new PIXI.Container();
const subContainer = new PIXI.Container();
const g1 = new PIXI.Graphics();
const g2 = new PIXI.Graphics();
const g3 = new PIXI.Graphics();
const g4 = new PIXI.Graphics();

g1.lineStyle(20, "#ffffff", 1)
  .beginFill("#884433")
  .drawCircle(50, 50, 50)
  .endFill();
g1.position.set(200, 100);
g1.angle = 30;
g1.on("pointerdown", () => {
  console.log("g1 pointerdown!");
});

g2.lineStyle(20, "#ffffff", 1)
  .beginFill("#0000ff")
  .drawRect(-50, -75, 100, 150)
  .drawShape(g1.geometry.graphicsData[0].shape)
  .endFill();
g2.position.set(120, 60);
g2.angle = 15;
g2.scale.set(1.5, 1.7);
g2.on("pointerup", () => {
  console.log("g2 pointerup!");
});

g3.beginFill("#ff00ff").drawRoundedRect(100, 0, 50, 50, 10);
g3.angle = -20;

g4.lineStyle(20, "#ffff00", 1)
  .moveTo(0, 70)
  .lineTo(100, -30)
  .lineTo(30, 120)
  .lineTo(120, 10);
g4.angle = 20;

const sprite = PIXI.Sprite.from(lights);

subContainer.position.set(200, 200);
subContainer.addChild(g3, g4);
mainContainer.addChild(subContainer, g2, sprite);
pixiApp.stage.addChild(mainContainer);

(async () => {
  const canvasKit = await CanvasKitInit({
    locateFile: (file) => "/libs/skia/bin/" + file,
  });
  const skiaCanvas = document.createElement("canvas");
  skiaCanvas.width = 500;
  skiaCanvas.height = 400;
  skiaCanvas.id = "skia-canvas";
  document.getElementById("app")?.appendChild(skiaCanvas);
  const skiaWrapper = new SkiaWrapper(canvasKit);
  skiaWrapper.render(mainContainer, skiaCanvas);
  const button = document.getElementById("pdf-button") as HTMLButtonElement;
  button.addEventListener("click", () => {
    downloadPDF(skiaWrapper.generatePDF());
  });
})();

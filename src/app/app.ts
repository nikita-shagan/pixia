import * as PIXI from "pixi.js-legacy";
import SkiaWrapper from "../services/skia/skia-wrapper";
import "./app.css";
import lights from "../assets/1.png";
import CanvasKitInit from "skia";
import downloadPDF from "../utils/download-pdf";

const pixiApp = new PIXI.Application<HTMLCanvasElement>({
  width: 500,
  height: 400,
  backgroundColor: "101010",
  resolution: 1,
  forceCanvas: true,
});
const pixiHtmlCanvas = pixiApp.view;
document.getElementById("app")?.appendChild(pixiHtmlCanvas);
const pixiContainer = new PIXI.Container();
pixiContainer.interactive = true;
const subContainer = new PIXI.Container();
const g1 = new PIXI.Graphics();
const g2 = new PIXI.Graphics();
const g3 = new PIXI.Graphics();
const g4 = new PIXI.Graphics();

g1.lineStyle(2, "#ffffff", 1)
  .beginFill("#884433")
  .drawCircle(50, 50, 50)
  .endFill();
g1.scale.set(2, 2);
g1.position.set(200, 100);
g1.angle = 30;
g1.interactive = true;
g1.on("pointerdown", (e) => {
  console.log(e.clientX, e.clientY);
  g1.scale.set(0.99 * g1.scale.x, 0.99 * g1.scale.y);
});
g1.on("pointerup", () => {
  g1.scale.set((100 * g1.scale.x) / 99, (100 * g1.scale.y) / 99);
});

console.log(g1);

g2.lineStyle(1, "#ffffff", 1)
  .beginFill("#0000ff")
  .drawRect(-50, -75, 100, 150)
  .endFill();
g2.position.set(120, 60);
g2.angle = 15;
g2.scale.set(1.5, 1.7);
g2.interactive = true;
g2.on("pointerdown", () => {
  g2.scale.set(0.99 * g2.scale.x, 0.99 * g2.scale.y);
  g2.angle += 20;
});
g2.on("pointerup", () => {
  g2.scale.set((100 * g2.scale.x) / 99, (100 * g2.scale.y) / 99);
});

console.log(g2);

g3.interactive = true;
g3.beginFill("#ff00ff").drawRoundedRect(100, 0, 50, 50, 10);
g3.angle = -20;
g3.on("pointerdown", () => {
  g3.scale.set(0.99 * g3.scale.x, 0.99 * g3.scale.y);
});
g3.on("pointerup", () => {
  g3.scale.set((100 * g3.scale.x) / 99, (100 * g3.scale.y) / 99);
});

g4.eventMode = "dynamic";
g4.lineStyle(20, "#ffff00", 1)
  .moveTo(0, 70)
  .lineTo(100, -30)
  .lineTo(30, 120)
  .lineTo(120, 10);
g4.angle = 20;
g4.on("pointerdown", () => {
  g4.scale.set(0.99 * g4.scale.x, 0.99 * g4.scale.y);
});
g4.on("pointerup", () => {
  g4.scale.set((100 * g4.scale.x) / 99, (100 * g4.scale.y) / 99);
});

const sprite = PIXI.Sprite.from(lights);
sprite.interactive = true;
sprite.on("pointerdown", () => {
  sprite.scale.set(0.99 * sprite.scale.x, 0.99 * sprite.scale.y);
});
sprite.on("pointerup", () => {
  sprite.scale.set((100 * sprite.scale.x) / 99, (100 * sprite.scale.y) / 99);
});

subContainer.position.set(200, 200);
subContainer.addChild(g3, g4);
pixiContainer.addChild(subContainer, g2, sprite, g1);
pixiApp.stage.addChild(pixiContainer);
(async () => {
  const canvasKit = await CanvasKitInit({
    locateFile: (file) => "/libs/skia/bin/" + file,
  });
  const htmlSkiaCanvas = document.createElement("canvas");
  htmlSkiaCanvas.width = 500;
  htmlSkiaCanvas.height = 400;
  htmlSkiaCanvas.id = "skia-canvas";
  document.getElementById("app")?.appendChild(htmlSkiaCanvas);
  const skiaWrapper = new SkiaWrapper(canvasKit, pixiContainer, htmlSkiaCanvas);
  skiaWrapper.render();
  const button = document.getElementById("pdf-button") as HTMLButtonElement;
  button.addEventListener("click", () => {
    const pdfBytes = skiaWrapper.makePDF();
    downloadPDF(pdfBytes ?? "");
  });
})();

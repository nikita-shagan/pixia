import * as PIXI from 'pixi.js-legacy';

// Create Pixi application
const app = new PIXI.Application<HTMLCanvasElement>({
  width: 400,
  height: 400,
  backgroundColor: 0x1099bb,
  resolution: 1,
  forceCanvas: true,
});

document.getElementById('app')?.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);
const graphics = new PIXI.Graphics();
graphics.beginFill(0xff0000);
graphics.drawCircle(100, 100, 50);
graphics.endFill();
container.addChild(graphics);

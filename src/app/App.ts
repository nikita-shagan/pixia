import { createElement, downloadPDF } from "../utils/funtions";
import Button from "../components/Button/Button";
import CanvasContainer from "../components/CanvasContainer/CanvasContainer";
import Views from "../components/Views/Views";
import Controls from "../components/Controls/Controls";
import usePixiApp from "../hooks/usePixiApp";
import useSkiaWrapper from "../hooks/useSkiaWrapper";
import useCanvasKit from "../hooks/useCanvasKit";
import useRandomObjectsGenerator from "../hooks/useRandomObjectsGenerator";
import "./App.css";
import useViewWindow from "../hooks/useViewWindow";

export default async function App(): Promise<HTMLElement> {
  const canvasKit = await useCanvasKit();
  const viewWindow = useViewWindow();
  const randomObjectsGenerator = useRandomObjectsGenerator(viewWindow);
  const { pixiApp, pixiTopContainer } = usePixiApp(viewWindow);
  const { skiaRenderer, skiaCanvas } = await useSkiaWrapper(
    pixiTopContainer,
    canvasKit,
    viewWindow,
  );

  const handleAddObjectClick = () => {
    const randomObject = randomObjectsGenerator.createRandomObject();
    pixiTopContainer.addChild(randomObject);
    skiaRenderer.renderOnScreen();
  };

  const handleExportPdfClick = () => {
    const pdfBytes = skiaRenderer.renderOnPDF();
    if (pdfBytes) downloadPDF(pdfBytes);
  };

  skiaRenderer.renderOnScreen();

  return createElement(
    "div",
    { id: "app" },
    Controls({
      children: [
        Button({ onClick: handleAddObjectClick, text: "Добавить объект" }),
        Button({ onClick: handleExportPdfClick, text: "Экспорт в ПДФ" }),
      ],
    }),
    Views({
      children: [
        CanvasContainer({ canvas: pixiApp.view }),
        CanvasContainer({ canvas: skiaCanvas }),
      ],
    }),
  );
}

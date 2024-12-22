import App from "./src/app/App";
import Preloader from "./src/components/Preloader/Preloader";
import useCanvasKit from "./src/hooks/useCanvasKit";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const root = document.getElementById("app");
    if (root) {
      const preloader = Preloader();
      root.appendChild(preloader);
      const progressBar = preloader.querySelector(
        ".preloader-bar-body",
      ) as HTMLDivElement;
      const canvasKit = await useCanvasKit((percent) => {
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
      });
      root.replaceWith(App({ canvasKit }));
    }
  } catch (e) {
    console.log(e);
  }
});

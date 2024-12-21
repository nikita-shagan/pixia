import App from "./src/app/App";

(async () => {
  const app = new App();
  await app.init();
})();

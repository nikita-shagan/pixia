import App from "./src/app/App";

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("app");
  if (root) {
    root.replaceWith(await App());
  }
});

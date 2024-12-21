# Pixia
A TypeScript application combining the capabilities of Pixi.js and Skia.

Check it out at [https://pixia.shagan.pro/](https://pixia.shagan.pro/)

## Features
- **Custom Rendering:** Renders Pixi containers using a custom WebAssembly (WASM) build of the Skia library.
- **Export Functionality:** Allows exporting rendered images as PDF files in vector format.
- **Interactivity:** Includes `pointerdown` and `pointerup` mouse interaction support.

## Development Setup
Run the following command to start a development server:
```bash
npm run dev
```
The live server will be available at http://localhost:3000/.

## Production Setup
To build the production-ready static files, use:
```bash
npm run build
```
The static files will be generated in the dist folder.